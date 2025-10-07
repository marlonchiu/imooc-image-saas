'use client'

import Uppy, { type UppyFile, type UploadResult } from '@uppy/core'
import AwsS3 from '@uppy/aws-s3'
import { useState, useEffect } from 'react'
import { useUppyState } from './useUppyState'
import { trpcPureClient, trpcClientReact } from '@/utils/api'
import { Button } from '@/components/ui/button'
import { UploadButton } from '@/components/feature/UploadButton'
import { Dropzone } from '@/components/feature/Dropzone'
import { UploadPreview } from '@/components/feature/UploadPreview'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { usePasteFile } from '@/hooks/usePasteFile'

export default function Index() {
  const [uppy] = useState(() => {
    const uppy = new Uppy()
    uppy.use(AwsS3, {
      shouldUseMultipart: false,
      getUploadParameters(file) {
        console.log('🚀 ~ getUploadParameters ~ file:', file)

        return trpcPureClient.file.createPresignedUrl.mutate({
          filename: file.data instanceof File ? file.data.name : 'test',
          contentType: file.data.type || '',
          size: file.data.size || file.size || 0
        })
      }
    })

    return uppy
  })

  const utils = trpcClientReact.useUtils()

  const { data: fileList, isPending } = trpcClientReact.file.listFiles.useQuery()
  const [uploadingFileIDs, setUploadingFileIDs] = useState<string[]>([])
  const uppyFiles = useUppyState(uppy, (s) => s.files)

  // const files = useUppyState(uppy, (s) => Object.values(s.files))

  useEffect(() => {
    const handler = (file, response) => {
      if (file) {
        trpcPureClient.file.saveFile
          .mutate({
            name: file.data instanceof File ? file.data.name : 'test',
            path: response.uploadURL ?? '',
            type: file.data.type
          })
          .then((resp) => {
            utils.file.listFiles.setData(void 0, (prev) => {
              if (!prev) {
                return prev
              }
              return [resp, ...prev]
            })
          })
      }
    }

    const uploadProgressHandler = (data) => {
      // 确保 fileIDs 存在且可迭代
      const fileIDs = Array.isArray(data.fileIDs) ? data.fileIDs : Object.keys(data.files || {})

      setUploadingFileIDs((currentFiles) => [...currentFiles, ...fileIDs])
    }

    const completeHandler = () => {
      setUploadingFileIDs([])
    }

    uppy.on('upload', uploadProgressHandler)
    uppy.on('upload-success', handler)
    uppy.on('complete', completeHandler)

    return () => {
      uppy.off('upload-success', handler)
      uppy.off('upload', uploadProgressHandler)
      uppy.off('complete', completeHandler)
    }
  }, [uppy])

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

  return (
    <div className="container mx-auto p-2">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => {
            uppy.upload()
          }}
        >
          Upload
        </Button>
        <UploadButton uppy={uppy}></UploadButton>
      </div>
      {isPending && <div>Loading</div>}
      <Dropzone uppy={uppy}>
        {(dragging) => {
          return (
            <div className={cn('relative flex flex-wrap gap-4', dragging && 'border border-dashed')}>
              {dragging && (
                <div className="absolute inset-0 bg-secondary/30 flex justify-center items-center text-3xl">
                  Drop File Here to Upload
                </div>
              )}

              {/* 正在上传 */}
              {uploadingFileIDs.length > 0 &&
                uploadingFileIDs.map((id) => {
                  const file = uppyFiles[id]

                  const isImage = file.data.type.startsWith('image')
                  const url = URL.createObjectURL(file.data)

                  return (
                    <div key={file.id} className="w-56 h-56 flex justify-center items-center border border-red-500">
                      {isImage ? (
                        <img src={url} alt={file.name} />
                      ) : (
                        <Image src="/unknown-file-types.png" alt="unknown file type" width={100} height={100}></Image>
                      )}
                    </div>
                  )
                })}

              {fileList?.map((file) => {
                const isImage = file.contentType.startsWith('image')

                return (
                  <div key={file.id} className="w-56 h-56 flex justify-center items-center border">
                    {isImage ? (
                      <img src={file.url} alt={file.name} />
                    ) : (
                      <Image src="/unknown-file-types.png" alt="unknown file type" width={100} height={100}></Image>
                    )}
                  </div>
                )
              })}
            </div>
          )
        }}
      </Dropzone>

      <UploadPreview uppy={uppy} />
    </div>
  )
}
