import Uppy from '@uppy/core'
import { ReactNode, HTMLAttributes, DragEvent, useRef, useState } from 'react'
export function Dropzone({
  uppy,
  children,
  ...divProps
}: {
  uppy: Uppy
  children: ReactNode | ((dragging: boolean) => ReactNode)
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>) {
  const [dragging, setDragging] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    setDragging(true)
  }

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    timerRef.current = setTimeout(() => {
      setDragging(false)
    }, 50)
  }

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const files = e.dataTransfer.files
    Array.from(files).forEach((file) => {
      uppy.addFile({
        data: file,
        name: file.name
      })
    })
    setDragging(false)
  }

  return (
    <div {...divProps} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}>
      {typeof children === 'function' ? children(dragging) : children}
    </div>
  )
}
