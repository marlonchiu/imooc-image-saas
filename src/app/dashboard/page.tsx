'use client'

import Uppy from '@uppy/core'
import AwsS3 from '@uppy/aws-s3'
import { useState, useEffect } from 'react'
import { useUppyState } from './useUppyState'
import { trpcPureClient } from '@/utils/api'
import { Button } from '@/components/ui/button'

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

  return (
    <div className="h-screen flex justify-center items-center ">
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
              uppy.addFile({
                data: file,
                name: file.name
              })
            })
          }
        }}
        multiple
      ></input>
      {files.map((file) => {
        const url = URL.createObjectURL(file.data)

        return <img src={url} key={file.id} />
      })}
      <Button
        onClick={() => {
          uppy.upload()
        }}
      >
        Upload
      </Button>
      <div>{progress}</div>
    </div>
  )
}
