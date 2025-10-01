import NextAuth, { AuthOptions } from 'next-auth'
import GitlabProvider from 'next-auth/providers/gitlab'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import db from '@/server/index'

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  // Configure one or more authentication providers
  // https://next-auth.js.org/configuration/providers/credentials
  providers: [
    GitlabProvider({
      clientId: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET
    })
  ]
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
