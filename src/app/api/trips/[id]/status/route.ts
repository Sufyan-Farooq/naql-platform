import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { TripStatus } from '@prisma/client';

const STATUS_TO_PROGRESS: Record<TripStatus, number> = {
  ASSIGNED: 3,
  AT_PICKUP: 4,
  LOADED: 5,
  IN_TRANSIT: 6,
  AT_DELIVERY: 7,
  DELIVERED: 8,
  INVOICED: 8,
};

// PATCH /api/trips/[id]/status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'CARRIER') {
    return NextResponse.json({ error: 'Only carriers can update trip status' }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  if (trip.carrierId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const newStatus = status.toUpperCase() as TripStatus;
  const progress = STATUS_TO_PROGRESS[newStatus] ?? trip.progress;
  const now = new Date().toISOString();

  // Update events
  const events = trip.events as Array<{ title: string; titleEn: string; date: string; completed: boolean }>;
  const updatedEvents = events.map((ev, idx) => ({
    ...ev,
    completed: idx < progress ? true : ev.completed,
    date: idx < progress && !ev.date ? now : ev.date,
  }));

  // If delivered, update load status
  const tripsUpdate = await prisma.trip.update({
    where: { id },
    data: { status: newStatus, progress, events: updatedEvents, updatedAt: new Date() },
    include: { load: true },
  });

  if (newStatus === 'DELIVERED') {
    await prisma.load.update({ where: { id: trip.loadId }, data: { status: 'DELIVERED' } });
  }
  if (newStatus === 'INVOICED') {
    await prisma.load.update({ where: { id: trip.loadId }, data: { status: 'COMPLETED' } });
  }

  return NextResponse.json({ trip: tripsUpdate });
}
