import { protectedProcedure, router } from '../trpc'
import db from '@/server/db/db'
import { storageConfiguration } from '../db/schema'
import * as z from 'zod'

export const storagesRoutes = router({
  listStorages: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx

    const result = await db.query.storageConfiguration.findMany({
      where: (storages, { eq, and, isNull }) => and(eq(storages.userId, session.user.id), isNull(storages.deletedAt))
      // orderBy: [desc(apps.createdAt)]
    })

    return result
  }),
  createStorage: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(50),
        bucket: z.string(),
        region: z.string(),
        accessKeyId: z.string(),
        secretAccessKey: z.string(),
        apiEndpoint: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx
      const { name, ...configuration } = input

      const result = await db
        .insert(storageConfiguration)
        .values({
          name: name,
          configuration: configuration,
          userId: session.user.id
        })
        .returning()

      return result[0]
    })
})
