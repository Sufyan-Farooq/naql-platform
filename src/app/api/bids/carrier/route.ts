import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'CARRIER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bids = await prisma.bid.findMany({
    where: { carrierId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      load: {
        include: {
          shipper: { select: { name: true, company: true } },
          _count: { select: { bids: true } }
        }
      }
    }
  });

  return NextResponse.json({ bids });
}
