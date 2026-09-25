import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email';
import { findUserByEmail } from '@/lib/mockUsers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email address is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = findUserByEmail(normalizedEmail);
    const displayName = name || user?.name || 'Valued Member';

    // Generate 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const verifyUrl = `${origin}/verify-email?email=${encodeURIComponent(normalizedEmail)}&code=${code}`;

    const result = await sendVerificationEmail({
      to: normalizedEmail,
      name: displayName,
      code,
      verifyUrl,
    });

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${normalizedEmail}`,
      code, // return to client sync
    });
  } catch (error: any) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
