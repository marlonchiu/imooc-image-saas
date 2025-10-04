import { getServerSession } from '@/server/auth'
import { initTRPC, TRPCError } from '@trpc/server'

export async function createTRPCContext() {
  const session = await getServerSession()
  // console.log('🚀 ~~~~~ session:', session)

  // if (!session?.user) {
  //   throw new TRPCError({ code: 'FORBIDDEN' })
  // }

  return { session }
}

const t = initTRPC.context<typeof createTRPCContext>().create()

const { router, procedure } = t

const logMiddleware = t.middleware(async ({ ctx, next }) => {
  const start = Date.now()

  const result = await next()

  console.log('---> Api time:', Date.now() - start)

  return result
})

const checkLoginMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  return next()
})

const loggedProcedure = procedure.use(logMiddleware)

const protectedProcedure = procedure.use(checkLoginMiddleware)

export const testRouter = router({
  greeting: loggedProcedure.query(async ({ ctx }) => {
    // console.log('🚀 ~ ctx:', ctx)
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, 1000)
    })

    return {
      message: 'Hello World'
    }
  })
})

export type TestRouter = typeof testRouter
