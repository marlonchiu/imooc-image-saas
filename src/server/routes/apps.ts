import { protectedProcedure, router } from '../trpc'
import { createAppsSchema } from '../db/validate-schema'
import db from '@/server/db/db'
import { apps } from '../db/schema'
import { v4 as uuidV4 } from 'uuid'

export const appsRoutes = router({
  createApp: protectedProcedure
    .input(createAppsSchema.pick({ name: true, description: true }))
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx

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
    })
})
