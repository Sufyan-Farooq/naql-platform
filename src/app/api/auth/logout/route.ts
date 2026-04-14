import { NextRequest, NextResponse } from 'next/server';
import { getSessionTokenFromCookies, deleteSession, clearSessionCookie } from '@/lib/auth';

export async function POST(_req: NextRequest) {
  const token = await getSessionTokenFromCookies();
  if (token) {
    await deleteSession(token);
    await clearSessionCookie();
  }
  return NextResponse.json({ ok: true });
}
