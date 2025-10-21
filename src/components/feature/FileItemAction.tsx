import { trpcClientReact } from '@/utils/api'
import { Button } from '@/components/ui/button'
import { Trash2, Copy } from 'lucide-react'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'

export function DeleteFile({ fileId, onDeleteSuccess }: { fileId: string; onDeleteSuccess: (fileId: string) => void }) {
  const { mutate: deleteFile, isPending } = trpcClientReact.file.deleteFile.useMutation({
    onSuccess() {
      onDeleteSuccess(fileId)
    }
  })

  const handleRemoveFile = () => {
    deleteFile(fileId)
    toast('Delete Succeed!')
  }

  return (
    <Button variant="ghost" onClick={handleRemoveFile} disabled={isPending}>
      <Trash2 />
    </Button>
  )
}
export function CopyFileUrl({ url }: { url: string }) {
  const handleCopyFile = () => {
    copy(url)
    toast('Url Copy Succeed!')
  }
  return (
    <Button variant="ghost" onClick={handleCopyFile}>
      <Copy />
    </Button>
  )
}

export function MakerFile({ onClick }: { onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <Button variant="ghost" onClick={onClick}>
      <Copy />
    </Button>
  )
}
