import { httpBatchLink, createTRPCClient } from '@trpc/client'
import { type OpenRouter } from './open-router-dts'

export const openApiClient = createTRPCClient<OpenRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/open'
    })
  ]
})

export const createOpenApiClient = ({ apiKey, signedToken }: { apiKey?: string; signedToken?: string }) => {
  const headers: Record<string, string> = {}

  if (apiKey) {
    headers['api-key'] = apiKey
  }

  if (signedToken) {
    headers['signed-token'] = signedToken
  }

  return createTRPCClient<OpenRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/api/open',
        headers: headers
      })
    ]
  })
}

export { OpenRouter }
