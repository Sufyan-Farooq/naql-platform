import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// POST /api/bids/[id]/accept — shipper accepts a bid, creates Trip
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SHIPPER') {
    return NextResponse.json({ error: 'Only shippers can accept bids' }, { status: 401 });
  }

  const { id: bidId } = await params;

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: { load: true },
  });

  if (!bid) return NextResponse.json({ error: 'Bid not found' }, { status: 404 });
  if (bid.load.shipperId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (bid.status !== 'PENDING') return NextResponse.json({ error: 'Bid already processed' }, { status: 400 });
  if (bid.load.status !== 'ACTIVE') return NextResponse.json({ error: 'Load already assigned' }, { status: 400 });

  const now = new Date().toISOString();

  // Transact: accept bid, reject others, update load, create trip
  const [, , , trip] = await prisma.$transaction([
    // Accept this bid
    prisma.bid.update({ where: { id: bidId }, data: { status: 'ACCEPTED' } }),
    // Reject all other bids for this load
    prisma.bid.updateMany({
      where: { loadId: bid.loadId, id: { not: bidId } },
      data: { status: 'REJECTED' },
    }),
    // Update load status
    prisma.load.update({ where: { id: bid.loadId }, data: { status: 'PENDING_ASSIGNMENT' } }),
    // Create trip
    prisma.trip.create({
      data: {
        loadId: bid.loadId,
        bidId,
        carrierId: bid.carrierId,
        status: 'ASSIGNED',
        progress: 3,
        events: [
          { title: 'تم نشر الحمولة', titleEn: 'Load Posted', date: bid.load.createdAt.toISOString(), completed: true },
          { title: 'تم قبول العرض', titleEn: 'Bid Accepted', date: now, completed: true },
          { title: 'تم تعيين الناقل', titleEn: 'Carrier Assigned', date: now, completed: true },
          { title: 'وصل لمكان الاستلام', titleEn: 'Arrived at Pickup', date: '', completed: false },
          { title: 'تم تحميل البضاعة', titleEn: 'Cargo Loaded', date: '', completed: false },
          { title: 'في الطريق', titleEn: 'In Transit', date: '', completed: false },
          { title: 'وصل للتسليم', titleEn: 'Arrived at Delivery', date: '', completed: false },
          { title: 'تم التسليم', titleEn: 'Delivered', date: '', completed: false },
        ],
      },
    }),
  ]);

  return NextResponse.json({ trip });
}
