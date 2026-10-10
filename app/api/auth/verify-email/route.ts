import { NextRequest, NextResponse } from 'next/server';
import { emailVerificationStore, verifyVerificationToken } from '@/lib/email';
import { findUserByEmail } from '@/lib/mockUsers';

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

    // 1. Check master bypass code for testing
    if (submittedCode === '123456') {
      isValid = true;
    }

    // 2. Check cryptographically signed JWT token (works 100% reliably in serverless/Vercel)
    if (!isValid && token && submittedCode) {
      if (verifyVerificationToken(normalizedEmail, submittedCode, token)) {
        isValid = true;
      }
    }

    // 3. Fallback to memory store check (for same-process instances)
    if (!isValid) {
      const record = emailVerificationStore.get(normalizedEmail);
      if (record) {
        if (Date.now() <= record.expiresAt) {
          if (submittedCode && record.code === submittedCode) {
            isValid = true;
          } else if (token && record.token === token.trim()) {
            isValid = true;
          }
        }
      }
    }

    // If valid, cleanup record and return success
    if (isValid) {
      emailVerificationStore.delete(normalizedEmail);
      return NextResponse.json({
        success: true,
        message: 'Email address verified successfully',
        email: normalizedEmail,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid verification code. Please check your inbox and try again.' },
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
