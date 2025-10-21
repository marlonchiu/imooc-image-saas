import { protectedProcedure, router } from '../trpc'
import db from '@/server/db/db'
import { apiKeys } from '../db/schema'
import { TRPCError } from '@trpc/server'
import { v4 as uuidV4 } from 'uuid'
import z from 'zod'

export const apiKeysRoutes = router({
  listApiKeys: protectedProcedure.input(z.object({ appId: z.string() })).query(async ({ ctx, input }) => {
    return db.query.apiKeys.findMany({
      where: (apiKeys, { eq, and, isNull }) => and(eq(apiKeys.appId, input.appId), isNull(apiKeys.deletedAt)),
      columns: { key: false }
    })
  }),
  requestKey: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
    const result = await db.query.apiKeys.findFirst({
      where: (apiKeys, { eq, isNull, and }) =>
        and(eq(apiKeys.id, input), isNull(apiKeys.deletedAt)),
      with: {
        app: {
          with: {
            user: true
          }
        }
      }
    })

    if (result?.app.user.id !== ctx.session.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }

    return result.key
  }),
  createApiKey: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(50),
        appId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .insert(apiKeys)
        .values({
          name: input.name,
          appId: input.appId,
          key: uuidV4(),
          clientId: uuidV4()
        })
        .returning()

      return result[0]
    })
})
