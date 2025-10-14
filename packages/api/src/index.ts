import { httpBatchLink, createTRPCClient } from '@trpc/client'
import { type OpenRouter } from './open-router-dts'

export const openApiClient = createTRPCClient<OpenRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/open'
    })
  ]
})

export const createOpenApiClient = ({ apiKey }: { apiKey: string }) => {
  return createTRPCClient<OpenRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/api/open',
        headers: {
          'api-key': apiKey
        }
      })
    ]
  })
}

export { OpenRouter }
