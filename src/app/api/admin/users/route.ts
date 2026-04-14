import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/admin/users — list all users
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');
  const status = searchParams.get('status');

  const where: Record<string, unknown> = {};
  if (role) where.role = role.toUpperCase();
  if (status) where.status = status.toUpperCase();

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, email: true, company: true, phone: true,
      role: true, status: true, crNumber: true, createdAt: true,
      _count: { select: { loads: true, bids: true } },
    },
  });

  return NextResponse.json({ users });
}
