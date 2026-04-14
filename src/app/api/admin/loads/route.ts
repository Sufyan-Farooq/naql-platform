import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/admin/loads — all loads with full details
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const where: Record<string, unknown> = {};
  if (status) where.status = status.toUpperCase();

  const loads = await prisma.load.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      shipper: { select: { name: true, company: true, email: true } },
      _count: { select: { bids: true } },
      bids: {
        where: { status: 'ACCEPTED' },
        include: { carrier: { select: { name: true, company: true } } },
        take: 1,
      },
      trip: { select: { status: true, progress: true } },
    },
  });

  return NextResponse.json({ loads });
}
