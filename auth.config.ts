import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma/prisma';
import { sendVerificationRequest } from './lib/authSendRequest';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';

const config = {
  theme: { logo: '/inverted-logo.svg' },
  adapter: PrismaAdapter(prisma as any),
  providers: [
    {
      id: 'http-email',
      name: 'Email',
      type: 'email',
      maxAge: 60 * 60 * 24,
      sendVerificationRequest,
    },
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  basePath: '/auth',
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;

      if (pathname === '/settings/users' || pathname === '/') {
        return !!auth;
      }

      return true;
    },
    jwt({ token, trigger, session, account }) {
      if (trigger === 'update') token.name = session.user.name;
      if (account?.provider === 'keycloak') {
        return { ...token, accessToken: account.access_token };
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }

      return session;
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
  debug: process.env.NODE_ENV !== 'production' ? true : false,
} satisfies NextAuthConfig;

export default config;