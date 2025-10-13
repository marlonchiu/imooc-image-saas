'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { trpcClientReact } from '@/utils/api'
import { Plus } from 'lucide-react'
import { useState } from 'react'

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
      {apiKeys?.map((apiKey) => {
        return (
          <div key={apiKey.id} className="border p-4 flex justify-between items-center">
            <span>{apiKey.name}</span>
            <span>{apiKey.key}</span>
          </div>
        )
      })}
    </div>
  )
}
