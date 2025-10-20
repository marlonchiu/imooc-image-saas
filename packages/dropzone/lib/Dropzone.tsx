import { useRef, useState, useEffect } from 'preact/hooks'
import type { ReactNode, HTMLAttributes } from 'preact/compat'

type CommonPreactComponentProps = {
  setChildrenContainer: (ele: HTMLElement | null) => void
}
export type DropzoneProps = {
  onDraggingChange: (dragging: boolean) => void
  onFileChose: (files: File[]) => void
  children: ReactNode | ((dragging: boolean) => ReactNode)
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'> &
  CommonPreactComponentProps

export function Dropzone({
  children,
  setChildrenContainer,
  onDraggingChange,
  onFileChose,
  ...divProps
}: DropzoneProps) {
  const [dragging, setDragging] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    onDraggingChange(dragging)
  }, [onDraggingChange, dragging])

  const onDragEnter = (e: DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault()

    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    timerRef.current = setTimeout(() => {
      setDragging(false)
    }, 50)
  }

  const onDragOver = (e: DragEvent) => {
    e.preventDefault()

    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : []
    onFileChose(files)
    setDragging(false)
  }

  return (
    <div
      ref={(e) => {
        setChildrenContainer(e)
      }}
      {...divProps}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    ></div>
  )
}
