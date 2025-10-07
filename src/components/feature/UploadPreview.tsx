import Uppy from '@uppy/core'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { useUppyState } from '@/app/dashboard/useUppyState'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LocalFileItem } from './FileItem'
export function UploadPreview({ uppy }: { uppy: Uppy }) {
  // const open = useUppyState(uppy, (s) => Object.keys(s.files).length > 0)

  const files = useUppyState(uppy, (s) => Object.values(s.files))
  const open = files.length > 0

  const [index, setIndex] = useState(0)

  const file = files[index]

  const isImage = file?.data?.type.startsWith('image')

  const handlePrev = () => {
    if (index === 0) {
      setIndex(files.length - 1)
    } else {
      setIndex(index - 1)
    }
  }
  const handleNext = () => {
    if (index === files.length - 1) {
      setIndex(0)
    } else {
      setIndex(index + 1)
    }
  }

  const clear = () => {
    files.map((file) => {
      uppy.removeFile(file.id)
    })
    setIndex(0)
  }

  if (!file) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(flag) => {
        if (flag === false) {
          clear()
        }
      }}
    >
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Upload Preview</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={handlePrev}>
            <ChevronLeft />
          </Button>
          <div key={file.id} className="w-56 h-56 flex justify-center items-center">
            <LocalFileItem file={file.data as File} />
          </div>
          <Button variant="ghost" onClick={handleNext}>
            <ChevronRight />
          </Button>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              uppy.removeFile(file.id)
              if (index === files.length - 1) {
                setIndex(files.length - 2)
              }
            }}
            variant="destructive"
          >
            Delete This
          </Button>
          <Button
            onClick={() => {
              uppy.upload().then(() => {
                clear()
              })
            }}
          >
            Upload All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
