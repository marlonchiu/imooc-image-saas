import { httpBatchLink, createTRPCClient } from '@trpc/client'
import { type OpenRouter } from '@/server/open-router'

export const openApiClient = createTRPCClient<OpenRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc'
    })
  ]
})

export { OpenRouter }
