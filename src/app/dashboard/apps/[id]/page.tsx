'use client'

import Uppy from '@uppy/core'
import AwsS3 from '@uppy/aws-s3'
import { useState } from 'react'

import { trpcPureClient, trpcClientReact } from '@/utils/api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { UploadButton } from '@/components/feature/UploadButton'
import { Dropzone } from '@/components/feature/Dropzone'
import { UploadPreview } from '@/components/feature/UploadPreview'
import { FileList } from '@/components/feature/FileList'
import { usePasteFile } from '@/hooks/usePasteFile'
import { type FilesOrderByColumn } from '@/server/routes/file'
import { MoveUp, MoveDown, Settings } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { UrlMaker } from './UrlMaker'

export default function AppPage({ params: { id: appId } }: { params: { id: string } }) {
  const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery(void 0, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  })

  const currentApp = apps?.filter((app) => app.id === appId)[0]

  const [uppy] = useState(() => {
    const uppy = new Uppy()
    uppy.use(AwsS3, {
      shouldUseMultipart: false,
      getUploadParameters(file) {
        return trpcPureClient.file.createPresignedUrl.mutate({
          filename: file.data instanceof File ? file.data.name : 'test',
          contentType: file.data.type || '',
          size: file.data.size || file.size || 0,
          appId: appId
        })
      }
    })

    return uppy
  })

  // 监听粘贴事件
  usePasteFile({
    onFilesPaste: (files) => {
      uppy.addFiles(
        files.map((file) => ({
          data: file,
          name: file.name
        }))
      )
    }
  })

  const [orderBy, setOrderBy] = useState<Exclude<FilesOrderByColumn, undefined>>({
    field: 'createdAt',
    order: 'desc'
  })

  const [showDeleted, setShowDeleted] = useState(false)

  const [makingUrlImageId, setMakingUrlImageId] = useState<string | null>(null)
  const onCheckedChange = (value: boolean) => {
    setShowDeleted(value)
  }

  let children: React.ReactNode
  if (isPending) {
    children = <div>Loading...</div>
  } else if (!currentApp) {
    children = (
      <div className="flex flex-col mt-10 p-4 border rounded-md max-w-48 mx-auto items-center">
        <p className="text-lg">App Not Exist</p>
        <p className="text-sm">Chose another one</p>
        <div className="flex flex-col gap-4 items-center">
          {apps?.map((app) => (
            <Button key={app.id} asChild variant="link">
              <Link href={`/dashboard/apps/${app.id}`}>{app.name}</Link>
            </Button>
          ))}
        </div>
      </div>
    )
  } else {
    children = (
      <div className="mx-auto h-full">
        <div className="container flex justify-between items-center h-[60px]">
          <div className="flex justify-start items-center">
            <Button
              onClick={() => {
                setOrderBy((current) => ({
                  ...current,
                  order: current?.order === 'asc' ? 'desc' : 'asc'
                }))
              }}
            >
              Created At {orderBy.order === 'desc' ? <MoveUp /> : <MoveDown />}
            </Button>
            <div className="flex items-center space-x-2 ml-2">
              <Switch id="is-show-deleted" checked={showDeleted} onCheckedChange={onCheckedChange} />
              <Label htmlFor="is-show-deleted">{showDeleted ? 'Show Deleted' : 'Hide Deleted'}</Label>
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <UploadButton uppy={uppy}></UploadButton>
            <Button asChild>
              <Link href="./new">New App</Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/apps/${appId}/setting/storage`}>
                <Settings></Settings>
              </Link>
            </Button>
          </div>
        </div>

        <Dropzone uppy={uppy} className="relative h-[calc(100%-60px)]">
          {(dragging) => {
            return (
              <>
                {dragging && (
                  <div className="absolute inset-0 bg-secondary/50 z-10 flex justify-center items-center text-3xl">
                    Drop File Here to Upload
                  </div>
                )}

                <FileList
                  uppy={uppy}
                  orderBy={orderBy}
                  appId={appId}
                  showDeleted={showDeleted}
                  onMakeUrl={(id) => setMakingUrlImageId(id)}
                />
              </>
            )
          }}
        </Dropzone>

        <UploadPreview uppy={uppy} />

        <Dialog
          open={Boolean(makingUrlImageId)}
          onOpenChange={(flag: boolean) => {
            if (flag === false) {
              setMakingUrlImageId(null)
            }
          }}
        >
          <DialogContent className="max-w-4xl" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Make Url</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            {makingUrlImageId && <UrlMaker id={makingUrlImageId} />}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return <>{children}</>
}
