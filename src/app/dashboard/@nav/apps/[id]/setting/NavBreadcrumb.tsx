'use client'

import Link from 'next/link'
import { Home, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { trpcClientReact } from '@/utils/api'
export function NavBreadcrumb({ id, leaf }: { id: string; leaf: string }) {
  const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery()
  const currentApp = apps?.find((app) => app.id === id)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/dashboard/apps/${id}`}>
              <Home size={20}></Home>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRightIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
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
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRightIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>
            <div className="text-base font-medium">{leaf}</div>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
