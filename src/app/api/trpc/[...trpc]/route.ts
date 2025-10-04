import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import type { NextRequest } from 'next/server'
import { testRouter, createTRPCContext } from '@/utils/trpc'

const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: testRouter,
    createContext: createTRPCContext
  })
}

export { handler as GET, handler as POST }
