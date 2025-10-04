'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { redirect } from 'next/navigation'
import { UserInfo, SessionProvider } from './UserInfo'
import { getServerSession } from '@/server/auth'
import { useEffect } from 'react'
import { trpcClient } from '@/utils/api'
export default  function Home() {
  // const session = await getServerSession()
  // console.log('🚀 ~ Home ~ session:', session)

  useEffect(() => {
    trpcClient.greeting.query()
  }, [])

  // if (!session?.user) {
  //   redirect('/api/auth/signin')
  // }

  return (
    <div className="h-screen flex justify-center items-center ">
      <form action="" className="w-full max-w-md flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Create App</h1>
        <Input name="name" placeholder="App Name" />
        <Textarea name="description" placeholder="Description" />
        <Button>Submit</Button>
      </form>
      <SessionProvider>
        <UserInfo></UserInfo>
      </SessionProvider>
    </div>
  )
}
