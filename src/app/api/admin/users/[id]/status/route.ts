import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { UserStatus } from '@prisma/client';

// PATCH /api/admin/users/[id]/status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { status } = await req.json();

  const newStatus = status.toUpperCase() as UserStatus;
  if (!['APPROVED', 'REJECTED', 'PENDING'].includes(newStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status: newStatus },
    select: { id: true, name: true, email: true, role: true, status: true, company: true },
  });

  return NextResponse.json({ user: updated });
}
