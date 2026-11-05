import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';
import { findUserByEmail, verifyUserCredentials } from '@/lib/mockUsers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    let user: any = null;

    // 1. Check Prisma SQLite
    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: { vendor: true },
      });
    } catch (err) {
      console.warn('Prisma query failed, checking persistent user store');
    }

    // 2. Fallback to persistent user store if Prisma didn't find the user
    if (!user) {
      const stored = findUserByEmail(cleanEmail);
      if (stored) {
        const verified = await verifyUserCredentials(cleanEmail, password);
        if (verified) {
          user = {
            id: stored.id,
            name: stored.name,
            email: stored.email,
            role: stored.role,
            status: 'active',
            vendor: null,
          };
        }
      }
    } else {
      if (user.status === 'banned') {
        return NextResponse.json(
          { message: 'Your account has been suspended. Please contact support.' },
          { status: 403 }
        );
      }

      const isMatch = await comparePassword(password, user.passwordHash);
      if (!isMatch) {
        // Also check plain fallback if imported or dev
        const fallbackStored = await verifyUserCredentials(cleanEmail, password);
        if (!fallbackStored) {
          return NextResponse.json(
            { message: 'Invalid email or password. Please check your details.' },
            { status: 401 }
          );
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password. Please check your details.' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      vendor: user.vendor || null,
      isEmailVerified: true,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        user: safeUser,
        token,
      },
      { status: 200 }
    );

    response.cookies.set('yabaright_user_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      response.cookies.set('yabaright_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login failed. Please try again later.' },
      { status: 500 }
    );
  }
}
