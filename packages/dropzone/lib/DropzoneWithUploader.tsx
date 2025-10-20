import Uppy, { UppyFile } from '@uppy/core'
import { Dropzone, DropzoneProps } from '.'
import { useEffect, useRef } from 'preact/hooks'

export function DropzoneWithUploader({
  uploader,
  onFileUploaded,
  ...dropzoneProps
}: {
  uploader: Uppy
  onFileUploaded: (url: string, file: UppyFile<Record<string, unknown>, Record<string, unknown>>) => {}
} & DropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const successCallback = (file: any, resp:any) => {
      onFileUploaded(resp.uploadURL!, file!)
    }
    const completeCallback = () => {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }

    uploader.on('upload-success', successCallback)
    uploader.on('complete', completeCallback)

    return () => {
      uploader.off('upload-success', successCallback)
      uploader.off('complete', completeCallback)
    }
  })

  function onFiles(files: File[]) {
    uploader.addFiles(
      files.map((file) => ({
        data: file,
        name: file.name
      }))
    )

    uploader.upload()
  }

  return <Dropzone {...dropzoneProps} onFileChose={onFiles}></Dropzone>
}
