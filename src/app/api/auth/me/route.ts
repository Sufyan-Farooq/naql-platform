import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, toUserDTO } from '@/lib/auth';

export async function GET(_req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return NextResponse.json({ user: toUserDTO(user) });
}
