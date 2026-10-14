import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin UI Pages
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminToken = request.cookies.get('yabaright_admin_token')?.value;

    if (!adminToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token structure
    try {
      const parts = adminToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      if (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN') {
        throw new Error('Insufficient permissions');
      }
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        throw new Error('Token expired');
      }
    } catch (e) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Admin APIs
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/auth') {
    const adminToken =
      request.cookies.get('yabaright_admin_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      );
    }

    try {
      const parts = adminToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      if (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { error: 'Forbidden. Admin role required.' },
          { status: 403 }
        );
      }
    } catch (e) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid admin session.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
