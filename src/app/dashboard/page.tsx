'use client'

import Uppy from '@uppy/core'
import AwsS3 from '@uppy/aws-s3'
import { useState, useEffect } from 'react'
import { useUppyState } from './useUppyState'
import { trpcPureClient, trpcClientReact } from '@/utils/api'
import { Button } from '@/components/ui/button'
import { UploadButton } from '@/components/feature/UploadButton'
import Image from 'next/image'

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

  const files = useUppyState(uppy, (s) => Object.values(s.files))
  const progress = useUppyState(uppy, (s) => s.totalProgress)

  useEffect(() => {
    const handler = (file, resp) => {
      if (file) {
        trpcPureClient.file.saveFile.mutate({
          name: file.data instanceof File ? file.data.name : 'test',
          path: resp.uploadURL ?? '',
          type: file.data.type
        })
      }
    }

    uppy.on('upload-success', handler)

    return () => {
      uppy.off('upload-success', handler)
    }
  }, [uppy])

  const { data: fileList, isPending } = trpcClientReact.file.listFiles.useQuery()
  console.log(fileList)

  return (
    <div className="container mx-auto">
      <div>
        <UploadButton uppy={uppy}></UploadButton>
        <Button
          onClick={() => {
            uppy.upload()
          }}
        >
          Upload
        </Button>
      </div>
      {isPending && <div>Loading</div>}
      <div className="flex flex-wrap gap-4">
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
      {/*
      {files.map((file) => {
        const url = URL.createObjectURL(file.data)

        return <img src={url} key={file.id} />
      })}
       */}
    </div>
  )
}
