import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { createNewUser, findUserByEmail } from '@/lib/mockUsers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Full name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { message: 'Password must be at least 4 characters long' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExists = findUserByEmail(email);
    if (userExists) {
      return NextResponse.json(
        { message: 'This email is already registered. Please log in.' },
        { status: 409 }
      );
    }

    // Determine normalized role (BUYER, SELLER, or ADMIN)
    const validRole = ['BUYER', 'SELLER', 'ADMIN'].includes(String(role).toUpperCase())
      ? (String(role).toUpperCase() as 'BUYER' | 'SELLER' | 'ADMIN')
      : 'BUYER';

    // Create user
    const newUser = await createNewUser(name, email, password, validRole);

    // Generate token
    const token = generateToken(newUser.id, newUser.email);

    return NextResponse.json(
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
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
