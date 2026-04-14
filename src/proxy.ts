import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'naql_session';

// Routes that require auth — checked by prefix
const PROTECTED = [
  { prefix: '/shipper', role: 'SHIPPER' },
  { prefix: '/carrier', role: 'CARRIER' },
  { prefix: '/admin', role: 'ADMIN' },
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const matched = PROTECTED.find((p) => pathname.startsWith(p.prefix));
  if (!matched) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Call /api/auth/me (internal) to validate session without importing prisma in edge
  const meUrl = new URL('/api/auth/me', req.url);
  const meRes = await fetch(meUrl, {
    headers: { cookie: `${COOKIE_NAME}=${token}` },
  });

  if (!meRes.ok) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  const { user } = await meRes.json();

  // Role check
  if (user.role !== matched.role) {
    // Redirect to their own dashboard
    if (user.role === 'SHIPPER') return NextResponse.redirect(new URL('/shipper/dashboard', req.url));
    if (user.role === 'CARRIER') return NextResponse.redirect(new URL('/carrier/loads', req.url));
    if (user.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', req.url));
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Account must be approved (admins always pass)
  if (user.role !== 'ADMIN' && user.status !== 'APPROVED') {
    return NextResponse.redirect(new URL('/auth/pending', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/shipper/:path*', '/carrier/:path*', '/admin/:path*'],
};
