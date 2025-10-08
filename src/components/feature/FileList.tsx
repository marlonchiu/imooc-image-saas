import Uppy, { type UppyFile, type UploadResult } from '@uppy/core'
import { useState, useEffect, useRef } from 'react'
import { useUppyState } from '@/app/dashboard/useUppyState'
import { trpcPureClient, trpcClientReact, AppRouter } from '@/utils/api'
import { cn } from '@/lib/utils'
import { LocalFileItem, RemoteFileItem } from './FileItem'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type FilesOrderByColumn } from '@/server/routes/file'
import { DeleteFile, CopyFileUrl } from './FileItemAction'

import { inferRouterOutputs } from '@trpc/server'
type FileResult = inferRouterOutputs<AppRouter>['file']['listFiles']

const limit = 10
export function FileList({ uppy, orderBy }: { uppy: Uppy; orderBy: FilesOrderByColumn }) {
  const queryKey = { limit, orderBy }

  const {
    data: infinityQueryData,
    isPending,
    fetchNextPage
  } = trpcClientReact.file.infinityQueryFiles.useInfiniteQuery(queryKey, {
    getNextPageParam: (resp) => resp.nextCursor
  })

  const filesList = infinityQueryData ? infinityQueryData?.pages.flatMap((page) => page.items) : []
  // const filesList = infinityQueryData
  //   ? infinityQueryData.pages.reduce((result, page) => {
  //       return [...result, ...page.items]
  //     }, [] as FileResult)
  //   : []

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
            utils.file.infinityQueryFiles.setInfiniteData(queryKey, (prev) => {
              if (!prev) {
                return prev
              }
              return {
                ...prev,
                pages: prev.pages.map((page, index) => {
                  if (index === 0) {
                    return {
                      ...page,
                      items: [resp, ...page.items]
                    }
                  }
                  return page
                })
              }
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

  // ----------------------> intersection

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (bottomRef.current) {
      const observer = new IntersectionObserver(
        (e) => {
          console.log('🚀 ~ IntersectionObserver ~ e:', e)
          if (e[0].intersectionRatio > 0.1) {
            fetchNextPage()
          }
        },
        {
          threshold: 0.1
        }
      )

      observer.observe(bottomRef.current)
      const element = bottomRef.current

      return () => {
        observer.unobserve(element)
        observer.disconnect()
      }
    }
  }, [fetchNextPage])

  const handleDeleteFile = (fileId: string) => {
    utils.file.infinityQueryFiles.setInfiniteData(queryKey, (prev) => {
      if (!prev) {
        return prev
      }
      return {
        ...prev,
        pages: prev.pages.map((page, index) => {
          if (index === 0) {
            return {
              ...page,
              items: page.items.filter((item) => item.id !== fileId)
            }
          }

          return page
        })
      }
    })
  }

  return (
    <ScrollArea className="h-full">
      {isPending && <div>Loading</div>}

      <div className={cn('relative flex flex-wrap justify-center gap-4 container')}>
        {/* 正在上传 */}
        {uploadingFileIDs.length > 0 &&
          uploadingFileIDs.map((id) => {
            const file = uppyFiles[id]

            return (
              <div key={file.id} className="w-56 h-56 flex justify-center items-center border border-red-500">
                <LocalFileItem file={file.data as File} />
              </div>
            )
          })}

        {filesList?.map((file) => {
          return (
            <div key={file.id} className="relative w-56 h-56 flex justify-center items-center border">
              <div className="inset-0 absolute bg-background/30 opacity-0 hover:opacity-100 transition-all justify-center items-center flex">
                <CopyFileUrl url={file.url}></CopyFileUrl>
                <DeleteFile fileId={file.id} onDeleteSuccess={handleDeleteFile}></DeleteFile>
              </div>
              <RemoteFileItem contentType={file.contentType} name={file.name} url={file.url} />
            </div>
          )
        })}
      </div>
      <div ref={bottomRef} className={cn('justify-center p-8 hidden', filesList.length > 0 && 'flex')}>
        <Button variant="ghost" onClick={() => fetchNextPage()}>
          Load Next Page
        </Button>
      </div>
    </ScrollArea>
  )
}
