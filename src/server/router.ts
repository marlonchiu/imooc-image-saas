import { appsRoutes } from './routes/apps'
import { fileRoutes } from './routes/file'
import { router } from './trpc'

export const appRouter = router({
  apps: appsRoutes,
  file: fileRoutes
})

export type AppRouter = typeof appRouter
