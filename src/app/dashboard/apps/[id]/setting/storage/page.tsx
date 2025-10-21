'use client'

import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { trpcClientReact } from '@/utils/api'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function StoragePage({ params: { id } }: { params: { id: string } }) {
  const router = useRouter()
  const { data: storages } = trpcClientReact.storages.listStorages.useQuery()

  const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery()

  const utils = trpcClientReact.useUtils()

  const { mutate } = trpcClientReact.apps.changeStorage.useMutation({
    onSuccess: (data, { appId, storageId }) => {
      utils.apps.listApps.setData(void 0, (prev) => {
        if (!prev) {
          return prev
        }

        return prev.map((p) => (p.id === appId ? { ...p, storageId: storageId } : p))
      })
    }
  })

  const currentApp = apps?.filter((app) => app.id === id)[0]

  return (
    <div className="pt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl mb-6">Storage</h1>
        <Button onClick={() => router.push(`/dashboard/apps/${id}/setting/storage/new`)}>
          <Plus></Plus>
        </Button>
      </div>

      <Accordion type="single" collapsible>
        {storages?.map((storage) => {
          return (
            <AccordionItem key={storage.id} value={storage.id.toString()}>
              <AccordionTrigger className={storage.id === currentApp?.storageId ? 'text-destructive' : ''}>
                {storage.name}
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-lg mb-6">
                  <div className="flex justify-between items-center">
                    <span>region</span>
                    <span>{storage.configuration.region}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>bucket</span>
                    <span>{storage.configuration.bucket}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>apiEndpoint</span>
                    <span>{storage.configuration.apiEndpoint}</span>
                  </div>
                </div>
                <Button
                  disabled={storage.id === currentApp?.storageId}
                  onClick={() => {
                    mutate({ appId: id, storageId: storage.id })
                  }}
                >
                  {storage.id === currentApp?.storageId ? 'Used' : 'Use'}
                </Button>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      {/* {storages?.map((storage) => {
        return (
          <div key={storage.id} className="border p-4 flex justify-between items-center">
            <span>{storage.name}</span>
            <Button
              disabled={storage.id === currentApp?.storageId}
              onClick={() => {
                mutate({ appId: id, storageId: storage.id })
              }}
            >
              {storage.id === currentApp?.storageId ? 'Used' : 'Use'}
            </Button>
          </div>
        )
      })} */}
    </div>
  )
}
