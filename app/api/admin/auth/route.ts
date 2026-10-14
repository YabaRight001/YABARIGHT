import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query user from Prisma SQLite database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Invalid admin credentials or account is not an administrator.' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please verify your password.' },
        { status: 401 }
      );
    }

    const token = generateToken(user.id, user.email, user.role);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || '/logo.png',
      loginTime: new Date().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      user: safeUser,
    });

    // Set secure HTTP-only cookie for server-side middleware protection
    response.cookies.set('yabaright_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error during admin authentication' },
      { status: 500 }
    );
  }
}
