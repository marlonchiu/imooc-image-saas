import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import CreateApp from '../../new/page'
import BackableDialog from './BackableDialog'

export default function InterceptingCreateApp() {
  return (
    <BackableDialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <CreateApp></CreateApp>
      </DialogContent>
    </BackableDialog>
  )
}
