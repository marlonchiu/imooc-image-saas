import { getServerSession } from '@/server/auth'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

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
      <nav className="relative h-20 border-b">
        <div className="container h-full flex justify-end items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={session.user.image!} />
                <AvatarFallback>{session.user.name?.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="absolute top-0 h-full left-1/2 -translate-x-1/2 flex justify-center items-center">{nav}</div>
      </nav>
      <main className="h-[calc(100%-5rem)]">{children}</main>
    </div>
  )
}
