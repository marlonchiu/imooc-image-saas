'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ReactNode, useMemo } from 'react'
import { usePathname } from 'next/navigation'

export default function SettingLayout({ params: { id }, children }: { params: { id: string }; children: ReactNode }) {
  const path = usePathname()

  // isStoragePath isApiKeyPath 路径变量
  const isStoragePath = useMemo(() => `/dashboard/apps/${id}/setting/storage`, [id])
  const isApiKeyPath = useMemo(() => `/dashboard/apps/${id}/setting/api-key`, [id])

  return (
    <div className="flex justify-start container mx-auto">
      <div className="flex flex-col w-60 flex-shrink-0 pt-10 gap-4">
        <Button
          size="lg"
          asChild={path !== isStoragePath}
          variant={path === isStoragePath ? 'outline' : 'ghost'}
          disabled={path === isStoragePath}
        >
          {path !== isStoragePath ? <Link href={isStoragePath}>Storage</Link> : 'Storage'}
        </Button>
        <Button
          size="lg"
          asChild={path !== isApiKeyPath}
          variant={path === isApiKeyPath ? 'outline' : 'ghost'}
          disabled={path === isApiKeyPath}
        >
          {path !== isApiKeyPath ? <Link href={isApiKeyPath}>Api Key</Link> : 'Api Key'}
        </Button>
      </div>
      <div className="flex-grow pl-4">{children}</div>
    </div>
  )
}
