import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/loads/[id]/bids — get all bids for a load
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const load = await prisma.load.findUnique({ where: { id } });
  if (!load) return NextResponse.json({ error: 'Load not found' }, { status: 404 });

  // Shipper can only see bids on their own loads
  if (user.role === 'SHIPPER' && load.shipperId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Carriers only see their own bid for this load
  const where: any = { loadId: id };
  if (user.role === 'CARRIER') {
    where.carrierId = user.id;
  }

  const bids = await prisma.bid.findMany({
    where,
    orderBy: { price: 'asc' },
    include: {
      carrier: { select: { id: true, name: true, company: true, phone: true } },
    },
  });

  return NextResponse.json({ bids });
}

// POST /api/loads/[id]/bids — carrier submits a bid
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'CARRIER') {
    return NextResponse.json({ error: 'Only carriers can bid' }, { status: 401 });
  }

  const { id } = await params;
  
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { price, truckPlate, etaHours, notes, routePrices } = body;

  if (price === undefined || !truckPlate || !etaHours) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Check load exists and is active
  const load = await prisma.load.findUnique({ where: { id } });
  if (!load || load.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Load not available' }, { status: 400 });
  }

  // One bid per carrier per load
  const existing = await prisma.bid.findFirst({ where: { loadId: id, carrierId: user.id } });
  if (existing) {
    return NextResponse.json({ error: 'You already submitted a bid for this load' }, { status: 409 });
  }

  try {
    const bid = await prisma.bid.create({
      data: {
        loadId: id,
        carrierId: user.id,
        price: Number(price),
        truckPlate,
        etaHours: Number(etaHours),
        notes: notes || null,
        routePrices: routePrices || undefined,
      },
      include: { 
        carrier: { select: { id: true, name: true, company: true } } 
      },
    });

    return NextResponse.json({ bid }, { status: 201 });
  } catch (error) {
    console.error('Error creating bid:', error);
    return NextResponse.json({ error: 'Failed to submit bid' }, { status: 500 });
  }
}
