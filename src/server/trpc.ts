import { getServerSession } from '@/server/auth'
import { initTRPC, TRPCError } from '@trpc/server'
import { headers } from 'next/headers'
import db from '@/server/db/db'

const t = initTRPC.context().create()

const { router, procedure } = t

export const withLoggerProcedure = procedure.use(async ({ ctx, next }) => {
  const start = Date.now()
  const result = await next()
  console.log('---> Api time:', Date.now() - start)
  return result
})

export const withSessionMiddleware = t.middleware(async ({ ctx, next }) => {
  const session = await getServerSession()

  return next({
    ctx: {
      session
    }
  })
})

export const protectedProcedure = withLoggerProcedure.use(withSessionMiddleware).use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  return next({
    ctx: {
      session: ctx.session!
    }
  })
})

export const withAppProcedure = withLoggerProcedure.use(withSessionMiddleware).use(async ({ next }) => {
  const headerList = headers()
  const apiKey = headerList.get('api-key')

  if (!apiKey) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  const apiKeyAndAppUser = await db.query.apiKeys.findFirst({
    where: (apiKeys, { eq, and, isNull }) => and(eq(apiKeys.key, apiKey), isNull(apiKeys.deletedAt)),
    with: {
      app: {
        with: {
          user: true,
          storage: true
        }
      }
    }
  })

  if (!apiKeyAndAppUser) {
    throw new TRPCError({ code: 'NOT_FOUND' })
  }

  return next({
    ctx: {
      app: apiKeyAndAppUser.app,
      user: apiKeyAndAppUser.app.user
    }
  })
})

export { router }
