export { default } from "next-auth/middleware"

export const config = { matcher: ["/admin/:path*", "/api/auth/signin", "/api/auth/error", "/api/auth/verify-request", "/api/auth/new-user"] }
