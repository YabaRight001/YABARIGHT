import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, shopName, phone } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Full name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists in SQLite DB
    const userExists = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (userExists) {
      return NextResponse.json(
        { message: 'This email is already registered. Please log in.' },
        { status: 409 }
      );
    }

    // Role protection: Disallow registering as ADMIN from public API
    let assignedRole = 'BUYER';
    const requestedRole = String(role || '').toUpperCase();
    if (requestedRole === 'SELLER') {
      assignedRole = 'SELLER';
    } else if (requestedRole === 'AFFILIATE') {
      assignedRole = 'AFFILIATE';
    }

    const hashedPassword = await hashPassword(password);

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash: hashedPassword,
        role: assignedRole,
        phone: phone || null,
        avatar: '/logo.png',
      },
    });

    // If seller, create a vendor profile
    if (assignedRole === 'SELLER') {
      await prisma.vendor.create({
        data: {
          userId: newUser.id,
          shopName: shopName || `${name}'s Thrift Shop`,
          isVerified: false,
        },
      });
    }

    // Generate token
    const token = generateToken(newUser.id, newUser.email, newUser.role);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        token,
      },
      { status: 201 }
    );

    response.cookies.set('yabaright_user_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
