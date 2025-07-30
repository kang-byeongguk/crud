import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow access to the login page without authentication
    if (req.nextUrl.pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }

    // Protect other admin routes
    if (req.nextauth.token?.role !== "ADMIN" && req.nextUrl.pathname.startsWith("/admin")) {
      return new NextResponse("You are not authorized!", { status: 403 });
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/admin/:path*", "/posts/new", "/posts/:id/edit"] };
