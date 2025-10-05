import Uppy from '@uppy/core'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRef } from 'react'
export function UploadButton({ uppy }: { uppy: Uppy }) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => {
        uppy.addFile({
          data: file,
          name: file.name
        })
      })
      // 选择同一个文件不能监听到改变
      e.target.value = ''
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.click()
          }
        }}
      >
        <Plus />
      </Button>
      <input ref={inputRef} type="file" onChange={handleInputChange} multiple className="fixed left-[-10000px]"></input>
    </>
  )
}
