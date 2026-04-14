import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, createSession, setSessionCookie } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, password, phone, crNumber, role } = body;

    if (!name || !company || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const roleEnum = role.toUpperCase() as UserRole;
    if (!['SHIPPER', 'CARRIER'].includes(roleEnum)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        company,
        email,
        passwordHash,
        phone: phone || null,
        crNumber: crNumber || null,
        role: roleEnum,
        status: 'PENDING',
      },
    });

    // Create session immediately so we can show them a pending page
    const token = await createSession(user.id);
    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, company: user.company },
    });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
