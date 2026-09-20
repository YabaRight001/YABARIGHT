import { NextResponse } from 'next/server';

// Official system admin credentials
const SYSTEM_ADMIN = {
  id: 'adm-001',
  name: 'Chief Admin',
  email: 'yabatightofficial@gmail.com',
  password: 'admin1234',
  role: 'SUPER_ADMIN',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
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

    // Normalize email
    const cleanEmail = email.trim().toLowerCase();

    // Check official admin credentials or secondary test credentials
    const isValidAdmin =
      (cleanEmail === SYSTEM_ADMIN.email.toLowerCase() && password === SYSTEM_ADMIN.password) ||
      (cleanEmail === 'admin@yabaright.ng' && password === 'admin123') ||
      (cleanEmail === 'superadmin@yabaright.ng' && password === 'yaba2026');

    if (!isValidAdmin) {
      return NextResponse.json(
        { error: 'Invalid admin credentials. Please check your email and password.' },
        { status: 401 }
      );
    }

    // Admin authenticated successfully
    const adminUser = {
      id: SYSTEM_ADMIN.id,
      name: 'YabaRight Administrator',
      email: cleanEmail,
      role: 'SUPER_ADMIN',
      avatar: SYSTEM_ADMIN.avatar,
      loginTime: new Date().toISOString(),
    };

    const token = `adm_tok_${Buffer.from(`${adminUser.id}:${Date.now()}`).toString('base64')}`;

    return NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      user: adminUser,
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error during admin authentication' },
      { status: 500 }
    );
  }
}
