import * as z from 'zod'
import { withAppProcedure, router } from '../trpc'
import { S3Client, PutObjectCommand, PutObjectCommandInput, S3ClientConfig } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { TRPCError } from '@trpc/server'
import { files } from '../db/schema'
import db from '@/server/db/db'
import { v4 as uuidV4 } from 'uuid'
import { sql, desc, asc, eq, and, isNull } from 'drizzle-orm'

// const { COS_APP_ID, COS_APP_SECRET, COS_APP_BUCKET, COS_APP_API_ENDPOINT, COS_APP_REGION } = process.env

import { filesCanOrderByColumns } from '../db/validate-schema'

const filesOrderByColumnSchema = z
  .object({
    field: filesCanOrderByColumns.keyof(),
    order: z.enum(['desc', 'asc'])
  })
  .optional()

export type FilesOrderByColumn = z.infer<typeof filesOrderByColumnSchema>

export const fileOpenRoutes = router({
  createPresignedUrl: withAppProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        size: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user, app } = ctx
      const date = new Date()

      const isoString = date.toISOString()

      const dateString = isoString.split('T')[0]

      if (!app || !app.storage) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      if (app.userId !== user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      const storage = app.storage
      const { bucket, apiEndpoint, region, accessKeyId, secretAccessKey } = storage.configuration

      const params: PutObjectCommandInput = {
        Bucket: bucket,
        Key: `${dateString}/${input.filename.replaceAll(' ', '_')}`,
        ContentType: input.contentType,
        ContentLength: input.size
      }

      const s3Client = new S3Client({
        endpoint: apiEndpoint,
        region: region,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey
        }
      } as S3ClientConfig)

      const command = new PutObjectCommand(params)
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: 60
      })

      return {
        url,
        method: 'PUT' as const
      }
    }),
  saveFile: withAppProcedure
    .input(
      z.object({
        name: z.string(),
        path: z.string(),
        type: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user, app } = ctx
      const url = new URL(input.path)
      const photo = await db
        .insert(files)
        .values({
          ...input,
          appId: app.id,
          id: uuidV4(),
          path: url.pathname,
          url: url.toString(),
          contentType: input.type,
          userId: user.id
        })
        .returning()

      return photo[0]
    }),
  listFiles: withAppProcedure.input(z.object({ appId: z.string() })).query(async ({ ctx, input }) => {
    const { user } = ctx
    const result = await db.query.files.findMany({
      where: (files, { eq }) => and(eq(files.appId, input.appId), eq(files.userId, user.id)),
      orderBy: [desc(files.createdAt)]
    })

    return result
  }),
  infinityQueryFiles: withAppProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.string()
          })
          .optional(),
        limit: z.number().default(10),
        orderBy: filesOrderByColumnSchema,
        appId: z.string(),
        showDeleted: z.boolean().default(false)
      })
    )
    .query(async ({ ctx, input }) => {
      const { user } = ctx
      const { cursor, limit, orderBy = { field: 'createdAt', order: 'desc' }, showDeleted } = input
      const deletedFilter = showDeleted ? undefined : isNull(files.deletedAt)
      const userFilter = eq(files.userId, user.id)
      const appFilter = eq(files.appId, input.appId)

      const statement = db
        .select()
        .from(files)
        .limit(limit)
        .where(
          cursor
            ? and(
                sql`("files"."created_at", "files"."id") < (${new Date(cursor.createdAt).toISOString()}, ${cursor.id})`,
                deletedFilter,
                userFilter,
                appFilter
              )
            : and(deletedFilter, userFilter, appFilter)
        )
      // .orderBy(desc(files.createdAt))

      statement.orderBy(orderBy.order === 'desc' ? desc(files[orderBy.field]) : asc(files[orderBy.field]))
      const result = await statement

      return {
        items: result,
        nextCursor:
          result.length > 0
            ? {
                createdAt: result[result.length - 1].createdAt!,
                id: result[result.length - 1].id
              }
            : null
      }
    }),
  deleteFile: withAppProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const { user } = ctx
    const id = input

    const photo = await db
      .update(files)
      .set({ deletedAt: new Date() })
      .where(and(eq(files.id, id), eq(files.userId, user.id)))

    return photo
  })
})
