import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users, files } from './schema'
import * as z from 'zod'

export const insertUserSchema = createInsertSchema(users, {
  email: () => z.email()
})

export const updateUserSchema = insertUserSchema.pick({ email: true })

export const queryUserSchema = createSelectSchema(users)

export const queryFileSchema = createSelectSchema(files)

export const filesCanOrderByColumns = queryFileSchema.pick({
  createdAt: true,
  deletedAt: true
})
