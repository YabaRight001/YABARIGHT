import { NextRequest, NextResponse } from 'next/server';
import { emailVerificationStore } from '@/lib/email';
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
    const record = emailVerificationStore.get(normalizedEmail);

    let isValid = false;

    // Check master bypass code for testing
    if (code && code.trim() === '123456') {
      isValid = true;
    }

    // Check memory store
    if (!isValid && record) {
      if (Date.now() > record.expiresAt) {
        return NextResponse.json(
          { success: false, message: 'Verification code has expired. Please request a new one.' },
          { status: 400 }
        );
      }
      if (code && record.code === code.trim()) {
        isValid = true;
      } else if (token && record.token === token.trim()) {
        isValid = true;
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
