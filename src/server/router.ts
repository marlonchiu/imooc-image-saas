import { appsRoutes } from './routes/apps'
import { fileRoutes } from './routes/file'
import { storagesRoutes } from './routes/storages'
import { apiKeysRoutes } from './routes/apiKeys'
import { router } from './trpc'

export const appRouter = router({
  apps: appsRoutes,
  file: fileRoutes,
  storages: storagesRoutes,
  apiKeys: apiKeysRoutes,
})

export type AppRouter = typeof appRouter
