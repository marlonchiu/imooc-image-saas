import Uppy, { type UppyFile, type UploadResult } from '@uppy/core'
import { useState, useEffect } from 'react'
import { useUppyState } from '@/app/dashboard/useUppyState'
import { trpcPureClient, trpcClientReact } from '@/utils/api'
import Image from 'next/image'
import { cn } from '@/lib/utils'
export function FileList({ uppy }: { uppy: Uppy }) {
  const { data: fileList, isPending } = trpcClientReact.file.listFiles.useQuery()

  const utils = trpcClientReact.useUtils()

  const [uploadingFileIDs, setUploadingFileIDs] = useState<string[]>([])
  const uppyFiles = useUppyState(uppy, (s) => s.files)

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
  }, [uppy, utils])

  return (
    <>
      {isPending && <div>Loading</div>}

      <div className={cn('relative flex flex-wrap gap-4')}>
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
    </>
  )
}
