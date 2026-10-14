import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function generateAffiliateCode(name: string): string {
  const prefix = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) || 'YABA';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const suffix = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${prefix}-${suffix}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const email = searchParams.get('email');

    if (!code && !email) {
      return NextResponse.json(
        { success: false, message: 'Code or Email parameter is required' },
        { status: 400 }
      );
    }

    const affiliate = await prisma.affiliate.findFirst({
      where: {
        OR: [
          code ? { code: code.toUpperCase().trim() } : {},
          email ? { email: email.toLowerCase().trim() } : {},
        ],
      },
      include: {
        commissions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!affiliate) {
      return NextResponse.json(
        { success: false, message: 'Affiliate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      affiliate,
    });
  } catch (error: any) {
    console.error('Error querying affiliate:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch affiliate' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, userId } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { success: false, message: 'Full name, email, and phone are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if affiliate exists
    const existing = await prisma.affiliate.findUnique({
      where: { email: cleanEmail },
      include: { commissions: true },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Affiliate already registered',
        affiliate: existing,
      });
    }

    let code = generateAffiliateCode(fullName);
    // Ensure code uniqueness
    let duplicateCheck = await prisma.affiliate.findUnique({ where: { code } });
    while (duplicateCheck) {
      code = generateAffiliateCode(fullName);
      duplicateCheck = await prisma.affiliate.findUnique({ where: { code } });
    }

    const newAffiliate = await prisma.affiliate.create({
      data: {
        fullName: fullName.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        code,
        userId: userId || null,
      },
      include: {
        commissions: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Affiliate registered successfully!',
        affiliate: newAffiliate,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating affiliate:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to register affiliate' },
      { status: 500 }
    );
  }
}
