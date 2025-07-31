import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // If the request is for the login page, do nothing and let it pass.
  // This is the most important check to prevent the redirect loop.
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  // For any other page covered by the matcher, get the token.
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token exists, redirect to the login page.
  if (!token) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If a token exists, check for admin role on admin routes.
  if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
    // Not an admin, trying to access admin pages. Redirect them.
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // All good, let the request proceed.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/posts/new',
    '/posts/:id/edit'
  ],
};
