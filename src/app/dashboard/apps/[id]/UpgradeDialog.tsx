import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import PricePlan from './PricePlan'

export function UpgradeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (f: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade</DialogTitle>
          <DialogDescription> 你现在是免费用户，无法上传更多文件，请升级</DialogDescription>
        </DialogHeader>

        <PricePlan />
      </DialogContent>
    </Dialog>
  )
}
