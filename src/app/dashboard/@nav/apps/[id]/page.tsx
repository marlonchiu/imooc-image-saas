'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { trpcClientReact } from '@/utils/api'

export default function AppDashboardNav({ params: { id } }: { params: { id: string } }) {
  const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery()
  const currentApp = apps?.find((app) => app.id === id)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">{isPending ? 'Loading...' : currentApp ? currentApp.name : '...'}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {apps?.map((app) => {
          return (
            <DropdownMenuItem key={app.id} disabled={app.id === id}>
              <Link href={`/dashboard/apps/${app.id}`}>{app.name}</Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
