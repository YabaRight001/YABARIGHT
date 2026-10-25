import { PrismaClient } from '@prisma/client';

function sanitizeDbUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return url
    .replace(/[?&]channel_binding=[^&]+/g, '')
    .replace(/\?&/, '?')
    .replace(/\?$/, '');
}

// Ensure Neon / Vercel Postgres environment variables are mapped seamlessly
let rawUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED;

let rawUnpooled =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  rawUrl;

if (rawUrl) process.env.DATABASE_URL = sanitizeDbUrl(rawUrl);
if (rawUnpooled) process.env.DATABASE_URL_UNPOOLED = sanitizeDbUrl(rawUnpooled);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
