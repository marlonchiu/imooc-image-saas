import { openRouter } from '@/server/open-router'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import type { NextRequest } from 'next/server'

const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/open',
    req: request,
    router: openRouter,
    createContext: () => ({})
  })
}

export { handler as GET, handler as POST }
