'use client'

import Uppy from '@uppy/core'
import AwsS3 from '@uppy/aws-s3'
import { useState } from 'react'

import { trpcPureClient } from '@/utils/api'
import { Button } from '@/components/ui/button'
import { UploadButton } from '@/components/feature/UploadButton'
import { Dropzone } from '@/components/feature/Dropzone'
import { UploadPreview } from '@/components/feature/UploadPreview'
import { FileList } from '@/components/feature/FileList'
import { usePasteFile } from '@/hooks/usePasteFile'
import { type FilesOrderByColumn } from '@/server/routes/file'
import { MoveUp, MoveDown } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function Index() {
  const [uppy] = useState(() => {
    const uppy = new Uppy()
    uppy.use(AwsS3, {
      shouldUseMultipart: false,
      getUploadParameters(file) {
        return trpcPureClient.file.createPresignedUrl.mutate({
          filename: file.data instanceof File ? file.data.name : 'test',
          contentType: file.data.type || '',
          size: file.data.size || file.size || 0
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
  const onCheckedChange = (value: boolean) => {
    setShowDeleted(value)
  }

  return (
    <div className="mx-auto h-screen">
      <div className="container flex justify-between items-center h-[60px]">
        {/* <Button
          onClick={() => {
            uppy.upload()
          }}
        >
          Upload
        </Button> */}
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

        <UploadButton uppy={uppy}></UploadButton>
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

              <FileList uppy={uppy} orderBy={orderBy} showDeleted={showDeleted} />
            </>
          )
        }}
      </Dropzone>

      <UploadPreview uppy={uppy} />
    </div>
  )
}
