import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/loads — list loads (carriers see active, shippers see own)
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  let where: Record<string, unknown> = {};

  if (user.role === 'CARRIER') {
    where = { status: 'ACTIVE' };
  } else if (user.role === 'SHIPPER') {
    where = { shipperId: user.id };
    if (status) where.status = status.toUpperCase();
  } else if (user.role === 'ADMIN') {
    if (status) where.status = status.toUpperCase();
  }

  const loads = await prisma.load.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      shipper: { select: { name: true, company: true } },
      _count: { select: { bids: true } },
      bids: user.role === 'CARRIER' ? {
        where: { carrierId: user.id },
        select: { id: true, price: true, status: true }
      } : false,
    },
  });

  return NextResponse.json({ loads });
}

// POST /api/loads — shipper creates a load
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SHIPPER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { cargoContent, cargoType, cargoWeight, routes, bidCloseTime, isUrgent } = body;

  const missing = [];
  if (!cargoContent) missing.push('cargoContent');
  if (!cargoType) missing.push('cargoType');
  if (!routes || !Array.isArray(routes) || routes.length === 0) {
    missing.push('routes');
  } else {
    routes.forEach((r, idx) => {
      if (!r.origin || !r.destination || !r.truckType || !r.truckCount) {
        missing.push(`route[${idx}] fields`);
      }
    });
  }
  if (!bidCloseTime) missing.push('bidCloseTime');

  if (missing.length > 0) {
    console.log('Validation failed for multi-route load:', missing);
    return NextResponse.json({ error: `Missing or invalid fields: ${missing.join(', ')}` }, { status: 400 });
  }

  // Generate ref number
  const count = await prisma.load.count();
  const refNumber = `NAQL-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

  const load = await prisma.load.create({
    data: {
      shipperId: user.id,
      refNumber,
      cargoContent,
      cargoType,
      cargoWeight: parseFloat(cargoWeight || 0),
      routes: routes as unknown as Prisma.InputJsonValue,
      bidCloseTime: new Date(bidCloseTime),
      isUrgent: isUrgent || false,
    },
    include: { _count: { select: { bids: true } } },
  });

  return NextResponse.json({ load }, { status: 201 });
}
