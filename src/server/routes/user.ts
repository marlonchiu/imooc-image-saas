import { protectedProcedure, router } from '../trpc'
import db from '@/server/db/db'

export const userRoutes = router({
  getPlan: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx
    const result = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.user.id),
      columns: { plan: true }
    })

    return result?.plan
  })
})
