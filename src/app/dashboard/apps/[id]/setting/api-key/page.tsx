'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { trpcClientReact } from '@/utils/api'
import { Plus, Copy, Eye } from 'lucide-react'
import { useState } from 'react'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'

function KeyString({ id }: { id: number }) {
  const { data: key } = trpcClientReact.apiKeys.requestKey.useQuery(id)

  return (
    <div className="flex justify-end items-center gap-2">
      <span>{key}</span>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          copy(key!)
          toast('secret key copied!')
        }}
      >
        <Copy></Copy>
      </Button>
    </div>
  )
}

export default function ApiKeysPage({ params: { id } }: { params: { id: string } }) {
  const { data: apiKeys } = trpcClientReact.apiKeys.listApiKeys.useQuery({
    appId: id
  })

  const { mutate } = trpcClientReact.apiKeys.createApiKey.useMutation({
    onSuccess: (data) => {
      utils.apiKeys.listApiKeys.setData({ appId: id }, (prev) => {
        setNewApiKeyName('')

        if (!prev || !data) {
          return prev
        }

        return [data, ...prev]
      })
    }
  })

  const utils = trpcClientReact.useUtils()

  const [newApiKeyName, setNewApiKeyName] = useState('')
  const [showKeyMap, setShowKeyMap] = useState<Record<number, boolean>>({})

  return (
    <div className="pt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl mb-6">Api Keys</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <Plus></Plus>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-4">
              <Input placeholder="Name" onChange={(e) => setNewApiKeyName(e.target.value)}></Input>
              <Button
                type="submit"
                onClick={() => {
                  mutate({ appId: id, name: newApiKeyName })
                }}
              >
                Submit
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Accordion type="single" collapsible>
        {apiKeys?.map((apiKey) => {
          return (
            <AccordionItem key={apiKey.id} value={apiKey.id.toString()}>
              <AccordionTrigger>{apiKey.name}</AccordionTrigger>
              <AccordionContent>
                <div className="text-lg mb-4">
                  <div className="flex justify-between items-center">
                    <span>Client Id</span>
                    <div className="flex justify-end items-center gap-2">
                      <span>{apiKey.clientId}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          copy(apiKey.clientId)
                          toast('client id copied!')
                        }}
                      >
                        <Copy></Copy>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-lg mb-4">
                  <span>Secret Key</span>
                  {!showKeyMap[apiKey.id] && (
                    <Button
                      onClick={() => {
                        setShowKeyMap((oldMap) => ({
                          ...oldMap,
                          [apiKey.id]: true
                        }))
                      }}
                    >
                      <Eye></Eye>
                    </Button>
                  )}

                  {showKeyMap[apiKey.id] && <KeyString id={apiKey.id}></KeyString>}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      {/* {apiKeys?.map((apiKey) => {
        return (
          <div key={apiKey.id} className="border p-4 flex justify-between items-center">
            <span>{apiKey.name}</span>
            <span>{apiKey.key}</span>
          </div>
        )
      })} */}
    </div>
  )
}
