import { trpcClientReact } from '@/utils/api'
import { Button } from '@/components/ui/button'
import { Trash2, Copy } from 'lucide-react'
import copy from 'copy-to-clipboard'
export function DeleteFile({ fileId, onDeleteSuccess }: { fileId: string; onDeleteSuccess: (fileId: string) => void }) {
  const { mutate: deleteFile, isPending } = trpcClientReact.file.deleteFile.useMutation({
    onSuccess() {
      onDeleteSuccess(fileId)
    }
  })

  const handleRemoveFile = () => {
    deleteFile(fileId)
  }

  return (
    <Button variant="ghost" onClick={handleRemoveFile} disabled={isPending}>
      <Trash2 />
    </Button>
  )
}
export function CopyFileUrl({ url }: { url: string }) {
  return (
    <Button variant="ghost" onClick={() => copy(url)}>
      <Copy />
    </Button>
  )
}
