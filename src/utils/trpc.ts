import { appRouter } from '@/server/router'
import { initTRPC } from '@trpc/server'

const t = initTRPC.create()
const { createCallerFactory } = t

export const serverCaller = createCallerFactory(appRouter)
