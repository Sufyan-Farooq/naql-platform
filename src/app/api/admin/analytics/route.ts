import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { subDays, startOfDay, format } from 'date-fns';

// GET /api/admin/analytics
export async function GET(_req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // ── Overview counts ──────────────────────────────────────
  const [
    totalShippers, totalCarriers,
    pendingShippers, pendingCarriers,
    activeLo, totalBids, activeTrips,
    acceptedBids,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'SHIPPER' } }),
    prisma.user.count({ where: { role: 'CARRIER' } }),
    prisma.user.count({ where: { role: 'SHIPPER', status: 'PENDING' } }),
    prisma.user.count({ where: { role: 'CARRIER', status: 'PENDING' } }),
    prisma.load.count({ where: { status: 'ACTIVE' } }),
    prisma.bid.count(),
    prisma.trip.count({ where: { status: { in: ['ASSIGNED', 'AT_PICKUP', 'LOADED', 'IN_TRANSIT', 'AT_DELIVERY'] } } }),
    prisma.bid.findMany({ where: { status: 'ACCEPTED' }, select: { price: true } }),
  ]);

  const totalRevenue = acceptedBids.reduce((s, b) => s + b.price * 0.05, 0);

  // ── Weekly trend (last 8 weeks) ──────────────────────────
  const weeksBack = 8;
  const weeklyData: { week: string; loads: number; bids: number; revenue: number; shippers: number; carriers: number }[] = [];

  for (let w = weeksBack - 1; w >= 0; w--) {
    const from = startOfDay(subDays(new Date(), w * 7 + 6));
    const to   = startOfDay(subDays(new Date(), w * 7 - 1));
    const label = format(from, 'MMM d');

    const [wLoads, wBids, wShippers, wCarriers, wAcceptedBids] = await Promise.all([
      prisma.load.count({ where: { createdAt: { gte: from, lt: to } } }),
      prisma.bid.count({ where: { createdAt: { gte: from, lt: to } } }),
      prisma.user.count({ where: { role: 'SHIPPER', createdAt: { gte: from, lt: to } } }),
      prisma.user.count({ where: { role: 'CARRIER', createdAt: { gte: from, lt: to } } }),
      prisma.bid.findMany({ where: { status: 'ACCEPTED', createdAt: { gte: from, lt: to } }, select: { price: true } }),
    ]);

    const wRevenue = wAcceptedBids.reduce((s, b) => s + b.price * 0.05, 0);
    weeklyData.push({ week: label, loads: wLoads, bids: wBids, revenue: wRevenue, shippers: wShippers, carriers: wCarriers });
  }

  // ── Top routes ───────────────────────────────────────────
  const allLoads = await prisma.load.findMany({ select: { origin: true, destination: true } });
  const routeMap: Record<string, number> = {};
  allLoads.forEach(l => {
    const key = `${l.origin} → ${l.destination}`;
    routeMap[key] = (routeMap[key] || 0) + 1;
  });
  const topRoutes = Object.entries(routeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([route, count]) => ({ route, count }));

  // ── Cargo type distribution ──────────────────────────────
  const cargoLoads = await prisma.load.findMany({ select: { cargoType: true } });
  const cargoMap: Record<string, number> = {};
  cargoLoads.forEach(l => { cargoMap[l.cargoType] = (cargoMap[l.cargoType] || 0) + 1; });
  const cargoDistribution = Object.entries(cargoMap).map(([type, value]) => ({ type, value }));

  // ── Carrier performance ──────────────────────────────────
  const carriers = await prisma.user.findMany({
    where: { role: 'CARRIER', status: 'APPROVED' },
    select: {
      id: true, name: true, company: true,
      _count: { select: { bids: true, trips: true } },
    },
    orderBy: { bids: { _count: 'desc' } },
    take: 10,
  });

  return NextResponse.json({
    overview: {
      totalShippers, totalCarriers,
      pendingShippers, pendingCarriers,
      activeLoads: activeLo,
      totalBids,
      activeTrips,
      totalRevenue: Math.round(totalRevenue),
    },
    weeklyData,
    topRoutes,
    cargoDistribution,
    topCarriers: carriers,
  });
}
