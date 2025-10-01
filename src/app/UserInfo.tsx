'use client'

import { useSession, SessionProvider as NextAuthProvider } from 'next-auth/react'

export function UserInfo() {
  const session = useSession()
  console.log("🚀 ~ UserInfo ~ session:", session)
  const { data, status } = session

  if (status === 'authenticated') {
    return <p>Signed in as {data?.user?.name}</p>
  }

  return <a href="/api/auth/signin">Sign in</a>
}

export function SessionProvider(props: any) {
  return <NextAuthProvider {...props}></NextAuthProvider>
}
