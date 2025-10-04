'use client'

import Uppy from '@uppy/core'
import AwsS3 from '@uppy/aws-s3'
import { useState } from 'react'
import { useUppyState } from './useUppyState'
export default function Index() {
  const [uppy] = useState(() => {
    const uppy = new Uppy()
    uppy.use(AwsS3, {
      shouldUseMultipart: false,
      getUploadParameters() {
        return {
          url: ''
        }
      }
    })
    return uppy
  })

  const files = useUppyState(uppy, (s) => Object.values(s.files))

  return (
    <div className="h-screen flex justify-center items-center ">
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
              uppy.addFile({
                name: file.name,
                type: file.type,
                data: file
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
    </div>
  )
}
