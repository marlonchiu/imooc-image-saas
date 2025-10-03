import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users } from './schema'
import * as z from 'zod'

export const insertUserSchema = createInsertSchema(users, {
  email: () => z.email(),
})

export const updateUserSchema = insertUserSchema.pick({ email: true })

export const queryUserSchema = createSelectSchema(users)
