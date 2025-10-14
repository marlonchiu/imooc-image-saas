import { httpBatchLink, createTRPCClient } from '@trpc/client'
import { type OpenRouter } from './open-router-dts'

export const openApiClient = createTRPCClient<OpenRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc'
    })
  ]
})

export { OpenRouter }
