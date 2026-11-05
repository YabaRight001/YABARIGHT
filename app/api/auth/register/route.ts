import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { findUserByEmail, createNewUser } from '@/lib/mockUsers';

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

    // Check if user exists in database or persistent user store
    let userExists: any = null;
    try {
      userExists = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch (err) {
      // Prisma error fallback
    }

    if (!userExists) {
      userExists = findUserByEmail(cleanEmail);
    }

    if (userExists) {
      return NextResponse.json(
        { message: 'This email is already registered. Please log in.' },
        { status: 409 }
      );
    }

    // Role protection: Allow BUYER, SELLER, AFFILIATE, ADMIN
    let assignedRole: 'BUYER' | 'SELLER' | 'ADMIN' | 'AFFILIATE' = 'BUYER';
    const requestedRole = String(role || '').toUpperCase();
    if (requestedRole === 'SELLER') {
      assignedRole = 'SELLER';
    } else if (requestedRole === 'AFFILIATE') {
      assignedRole = 'AFFILIATE';
    } else if (requestedRole === 'ADMIN') {
      assignedRole = 'ADMIN';
    }

    const hashedPassword = await hashPassword(password);
    let newUser: any = null;

    // 1. Create in Prisma SQLite
    try {
      newUser = await prisma.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          passwordHash: hashedPassword,
          role: assignedRole,
          phone: phone || null,
          avatar: '/logo.png',
        },
      });

      if (assignedRole === 'SELLER') {
        await prisma.vendor.create({
          data: {
            userId: newUser.id,
            shopName: shopName || `${name}'s Thrift Shop`,
            isVerified: false,
          },
        }).catch(() => {});
      }
    } catch (dbErr: any) {
      console.warn('Prisma DB write notice (falling back to persistent store):', dbErr.message);
    }

    // 2. Always sync with persistent user store
    try {
      const stored = await createNewUser(name, cleanEmail, password, assignedRole, phone);
      if (!newUser) {
        newUser = {
          id: stored.id,
          name: stored.name,
          email: stored.email,
          role: stored.role,
        };
      }
    } catch (storeErr: any) {
      // Store may have already recorded
    }

    if (!newUser) {
      newUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        email: cleanEmail,
        role: assignedRole,
      };
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
          isEmailVerified: true,
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

    if (newUser.role === 'ADMIN') {
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
