import { getServerSession } from '@/server/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function DashboardLayout({
  children,
  nav
}: Readonly<{
  children: React.ReactNode
  nav: React.ReactNode
}>) {
  const session = await getServerSession()

  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="h-screen">
      <nav className="h-20 flex justify-end items-center border-b relative">
        <Button variant="ghost">
          <Avatar>
            <AvatarImage src={session.user.image!} />
            <AvatarFallback>{session.user.name?.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </Button>
        <div className="absolute h-full left-1/2 -translate-x-1/2 flex justify-center items-center">{nav}</div>
      </nav>
      <main className="h-[calc(100%-5rem)]">{children}</main>
    </div>
  )
}
