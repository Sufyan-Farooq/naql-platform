import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/trips — get trips for current user
export async function GET(_req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let trips;
  if (user.role === 'CARRIER') {
    trips = await prisma.trip.findMany({
      where: { carrierId: user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        load: { include: { shipper: { select: { name: true, company: true } } } },
        bid: { select: { price: true, truckPlate: true } },
      },
    });
  } else if (user.role === 'SHIPPER') {
    trips = await prisma.trip.findMany({
      where: { load: { shipperId: user.id } },
      orderBy: { updatedAt: 'desc' },
      include: {
        load: true,
        carrier: { select: { name: true, company: true, phone: true } },
        bid: { select: { price: true, truckPlate: true } },
      },
    });
  } else if (user.role === 'ADMIN') {
    trips = await prisma.trip.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        load: { include: { shipper: { select: { name: true, company: true } } } },
        carrier: { select: { name: true, company: true } },
        bid: { select: { price: true } },
      },
    });
  }

  return NextResponse.json({ trips });
}
