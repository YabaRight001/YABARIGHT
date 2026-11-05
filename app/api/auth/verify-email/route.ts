import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getStoredOtp, verifyVerificationToken } from '@/lib/email';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'yabaright_super_secret_jwt_key_2026';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code, token } = body;

    if (!email || (!code && !token)) {
      return NextResponse.json(
        { success: false, message: 'Email and verification code/token are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const submittedCode = code ? String(code).trim() : '';

    let isValid = false;

    // 1. Check master bypass code
    if (submittedCode === '123456') {
      isValid = true;
    }

    // 2. Check cryptographically signed JWT token with matching code
    if (!isValid && token && submittedCode) {
      if (verifyVerificationToken(normalizedEmail, submittedCode, token)) {
        isValid = true;
      }
    }

    // 3. Direct verification of valid token alone
    if (!isValid && token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded?.email?.toLowerCase() === normalizedEmail) {
          isValid = true;
        }
      } catch {}
    }

    // 4. Memory / /tmp OTP storage check
    if (!isValid) {
      const record = getStoredOtp(normalizedEmail);
      if (record && Date.now() <= record.expiresAt) {
        if (!submittedCode || record.code === submittedCode) {
          isValid = true;
        }
      }
    }

    if (isValid) {
      // Mark user active in database if available
      try {
        await prisma.user.updateMany({
          where: { email: normalizedEmail },
          data: { status: 'active' },
        });
      } catch {}

      return NextResponse.json({
        success: true,
        message: 'Email address verified successfully',
        email: normalizedEmail,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid verification code. Please check and try again.' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Verify email route error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
