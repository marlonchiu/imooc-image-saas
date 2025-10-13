'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ReactNode, useMemo } from 'react'
import { usePathname } from 'next/navigation'

export default function SettingLayout({ params: { id }, children }: { params: { id: string }; children: ReactNode }) {
  const path = usePathname()

  const isStorageRoute = useMemo(() => path.startsWith(`/dashboard/apps/${id}/setting/storage`), [path, id])
  const isApiKeyRoute = useMemo(() => path.startsWith(`/dashboard/apps/${id}/setting/api-key`), [path, id])

  return (
    <div className="flex justify-start container mx-auto">
      <div className="flex flex-col w-60 flex-shrink-0 pt-10 gap-4">
        <Button
          size="lg"
          asChild={!isStorageRoute}
          variant={isStorageRoute ? 'outline' : 'ghost'}
          disabled={isStorageRoute}
        >
          {!isStorageRoute ? <Link href={`/dashboard/apps/${id}/setting/storage`}>Storage</Link> : 'Storage'}
        </Button>
        <Button
          size="lg"
          asChild={!isApiKeyRoute}
          variant={isApiKeyRoute ? 'outline' : 'ghost'}
          disabled={isApiKeyRoute}
        >
          {!isApiKeyRoute ? <Link href={`/dashboard/apps/${id}/setting/api-key`}>Api Key</Link> : 'Api Key'}
        </Button>
      </div>
      <div className="flex-grow pl-4">{children}</div>
    </div>
  )
}
