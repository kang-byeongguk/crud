import NextAuth from "next-auth"
import { getAuthOptions } from "@/lib/auth"

export const dynamic = 'force-dynamic';

const handler = NextAuth(getAuthOptions())

export { handler as GET, handler as POST }
