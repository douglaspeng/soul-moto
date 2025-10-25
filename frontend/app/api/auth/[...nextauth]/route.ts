import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SanityAdapter } from 'next-auth-sanity'
import { client } from '@/sanity/lib/client'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: SanityAdapter(client),
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        (session.user as any).id = token.sub
      }
      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        (token as any).uid = (user as any).id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
})

export { handler as GET, handler as POST }
