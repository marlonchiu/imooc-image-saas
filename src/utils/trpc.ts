import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

const { router, procedure } = t

export const testRouter = router({
  greeting: procedure.query(() => {
    return {
      message: 'Hello World'
    }
  })
})

export type TestRouter = typeof testRouter
