import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { AuthOptions, getServerSession as nextAuthGetServerSession } from 'next-auth'
import GitlabProvider from 'next-auth/providers/gitlab'
import GitHubProvider from 'next-auth/providers/github'
import db from '@/server/db/db'

// 环境变量检查
if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw new Error('Missing GITHUB_ID or GITHUB_SECRET environment variables')
}

if (!process.env.GITLAB_CLIENT_ID || !process.env.GITLAB_CLIENT_SECRET) {
  throw new Error('Missing GITLAB_CLIENT_ID or GITLAB_CLIENT_SECRET environment variables')
}

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    GitlabProvider({
      clientId: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET
    })
  ]
}

export function getServerSession() {
  return nextAuthGetServerSession(authOptions)
}
