'use client'

import { useSession, SessionProvider as NextAuthProvider } from 'next-auth/react'

export function UserInfo() {
  const session = useSession()
  console.log('🚀 ~ UserInfo ~ session:', session)
  const { data, status } = session

  if (status === 'authenticated') {
    return <p>Signed in as {data?.user?.name}</p>
  }

  return <a href="/api/auth/signin">Sign in</a>
}

// 忽略类型检查
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SessionProvider(props: any) {
  return <NextAuthProvider {...props}></NextAuthProvider>
}
