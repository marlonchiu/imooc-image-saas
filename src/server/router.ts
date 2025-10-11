import { appsRoutes } from './routes/apps'
import { fileRoutes } from './routes/file'
import { storagesRoutes } from './routes/storages'
import { router } from './trpc'

export const appRouter = router({
  apps: appsRoutes,
  file: fileRoutes,
  storages: storagesRoutes
})

export type AppRouter = typeof appRouter
