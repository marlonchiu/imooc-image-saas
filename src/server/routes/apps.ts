import { protectedProcedure, router } from '../trpc'
import { createAppsSchema } from '../db/validate-schema'
import db from '@/server/db/db'
import { apps, storageConfiguration } from '../db/schema'
import { v4 as uuidV4 } from 'uuid'
import { desc, eq, and, count, isNull } from 'drizzle-orm'
import z from 'zod'
import { TRPCError } from '@trpc/server'

export const appsRoutes = router({
  createApp: protectedProcedure
    .input(createAppsSchema.pick({ name: true, description: true }))
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx

      const isFreePlan = ctx.plan === 'free'
      // 免费用户只能创建一个应用
      if (isFreePlan) {
        const appCountResult = await db
          .select({ count: count() })
          .from(apps)
          .where(and(eq(apps.userId, session.user.id), isNull(apps.deletedAt)))

        const countNum = appCountResult[0].count
        if (countNum >= 1) {
          throw new TRPCError({ code: 'FORBIDDEN' })
        }
      }

      const result = await db
        .insert(apps)
        .values({
          id: uuidV4(),
          name: input.name,
          description: input.description,
          userId: session.user.id
        })
        .returning()

      return result[0]
    }),
  listApps: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx

    const result = await db.query.apps.findMany({
      where: (apps, { eq, and, isNull }) => and(eq(apps.userId, session.user.id), isNull(apps.deletedAt)),
      orderBy: [desc(apps.createdAt)]
    })

    return result
  }),
  changeStorage: protectedProcedure
    .input(z.object({ appId: z.string(), storageId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx

      const storage = await db.query.storageConfiguration.findFirst({
        where: (storages, { eq }) => eq(storageConfiguration.id, input.storageId)
      })

      // check if storage belongs to user
      if (storage?.userId !== session.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      await db
        .update(apps)
        .set({ storageId: input.storageId })
        .where(and(eq(apps.id, input.appId), eq(apps.userId, session.user.id)))
    })
})
