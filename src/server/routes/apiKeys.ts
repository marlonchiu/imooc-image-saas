import { protectedProcedure, router } from '../trpc'
import db from '@/server/db/db'
import { apiKeys } from '../db/schema'
import { v4 as uuidV4 } from 'uuid'
import z from 'zod'

export const apiKeysRoutes = router({
  listApiKeys: protectedProcedure.input(z.object({ appId: z.string() })).query(async ({ ctx, input }) => {
    return db.query.apiKeys.findMany({
      where: (apiKeys, { eq, and, isNull }) => and(eq(apiKeys.appId, input.appId), isNull(apiKeys.deletedAt))
    })
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
          key: uuidV4()
        })
        .returning()

      return result[0]
    })
})
