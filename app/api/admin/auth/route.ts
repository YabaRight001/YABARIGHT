import { NextResponse } from 'next/server';
import { findUserByEmail, verifyUserCredentials } from '@/lib/mockUsers';

// Official primary system admin credentials
const OFFICIAL_ADMIN = {
  id: 'adm-001',
  name: 'Chief Admin',
  email: 'yabarightofficial@gmail.com',
  password: 'admin1234',
  role: 'SUPER_ADMIN',
  avatar: '/logo.png',
};

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

    // 1. Check if user is registered with role 'ADMIN'
    const registeredUser = await verifyUserCredentials(cleanEmail, password);
    let authenticatedAdmin = null;

    if (registeredUser && registeredUser.role === 'ADMIN') {
      authenticatedAdmin = {
        id: registeredUser.id,
        name: registeredUser.name,
        email: registeredUser.email,
        role: 'ADMIN',
        avatar: '/logo.png',
        loginTime: new Date().toISOString(),
      };
    } else if (cleanEmail === OFFICIAL_ADMIN.email.toLowerCase() && password === OFFICIAL_ADMIN.password) {
      authenticatedAdmin = {
        id: OFFICIAL_ADMIN.id,
        name: OFFICIAL_ADMIN.name,
        email: OFFICIAL_ADMIN.email,
        role: 'SUPER_ADMIN',
        avatar: OFFICIAL_ADMIN.avatar,
        loginTime: new Date().toISOString(),
      };
    } else if (
      (cleanEmail === 'admin@yabaright.ng' && password === 'admin123') ||
      (cleanEmail === 'superadmin@yabaright.ng' && password === 'yaba2026')
    ) {
      authenticatedAdmin = {
        id: `adm-${Date.now()}`,
        name: 'YabaRight Administrator',
        email: cleanEmail,
        role: 'ADMIN',
        avatar: '/logo.png',
        loginTime: new Date().toISOString(),
      };
    }

    if (!authenticatedAdmin) {
      return NextResponse.json(
        { error: 'Invalid admin credentials or account is not registered as an administrator.' },
        { status: 401 }
      );
    }

    const token = `adm_tok_${Buffer.from(`${authenticatedAdmin.id}:${Date.now()}`).toString('base64')}`;

    return NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      user: authenticatedAdmin,
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error during admin authentication' },
      { status: 500 }
    );
  }
}
