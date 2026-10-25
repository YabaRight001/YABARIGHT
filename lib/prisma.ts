import { PrismaClient } from '@prisma/client';

function sanitizeDbUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  try {
    const parsed = new URL(rawUrl);
    parsed.searchParams.delete('channel_binding');
    return parsed.toString();
  } catch (e) {
    return rawUrl;
  }
}

// Prefer unpooled direct Neon connection for rock-solid stability with Prisma
let rawUrl =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

if (rawUrl) {
  const sanitized = sanitizeDbUrl(rawUrl);
  process.env.DATABASE_URL = sanitized;
  process.env.DATABASE_URL_UNPOOLED = sanitized;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
