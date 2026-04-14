import bcrypt from 'bcryptjs';
import prisma from './prisma';
import { cookies } from 'next/headers';
import { User, UserRole, UserStatus } from '@prisma/client';

const SESSION_DURATION_DAYS = 7;
const COOKIE_NAME = 'naql_session';

// ----- Password helpers -----
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ----- Session helpers -----
export async function createSession(userId: string): Promise<string> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  const session = await prisma.session.create({
    data: { userId, expiresAt },
  });

  return session.token;
}

export async function getSessionUser(token: string): Promise<User | null> {
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { token } }).catch(() => {});
    }
    return null;
  }

  return session.user;
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.session.delete({ where: { token } }).catch(() => {});
}

// ----- Cookie helpers (server-only) -----
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

// ----- Auth guard -----
export async function getCurrentUser(): Promise<User | null> {
  const token = await getSessionTokenFromCookies();
  if (!token) return null;
  return getSessionUser(token);
}

// Serializable user DTO (safe to send to client)
export type UserDTO = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  company: string;
  phone: string | null;
};

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    company: user.company,
    phone: user.phone,
  };
}
