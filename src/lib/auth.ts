import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export function getAuthOptions(): NextAuthOptions {
  return {
    adapter: process.env.VERCEL_ENV === 'production' ? undefined : PrismaAdapter(db),
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/admin/login",
    },
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await db.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: `${user.id}`,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        },
      }),
      KakaoProvider({
        clientId: process.env.KAKAO_CLIENT_ID!,
        clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      }),
    ],
    callbacks: {
      async session({ session, token }) {
        if (token) {
          session.user.id = token.id;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.role = token.role;
        }

        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          console.log("User object from provider:", user);
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.role = user.role;
        }

        return token;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
}
