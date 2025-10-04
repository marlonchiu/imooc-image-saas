import * as z from 'zod'
import { protectedProcedure, router } from '../trpc'
import { S3Client, PutObjectCommand, PutObjectCommandInput, S3ClientConfig } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { files } from '../db/schema'
// import db from '../db/db'
import db from '@/server/db/db'
import { v4 as uuidV4 } from 'uuid'
import { desc } from 'drizzle-orm'

const { COS_APP_ID, COS_APP_SECRET, COS_APP_BUCKET, COS_APP_API_ENDPOINT, COS_APP_REGION } = process.env

export const fileRoutes = router({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        size: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const date = new Date()

      const isoString = date.toISOString()

      const dateString = isoString.split('T')[0]

      const params: PutObjectCommandInput = {
        Bucket: COS_APP_BUCKET,
        Key: `${dateString}/${input.filename.replaceAll(' ', '_')}`,
        ContentType: input.contentType,
        ContentLength: input.size
      }

      const s3Client = new S3Client({
        endpoint: COS_APP_API_ENDPOINT,
        region: COS_APP_REGION,
        credentials: {
          accessKeyId: COS_APP_ID,
          secretAccessKey: COS_APP_SECRET
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
  saveFile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        path: z.string(),
        type: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx
      const url = new URL(input.path)
      const photo = await db
        .insert(files)
        .values({
          ...input,
          id: uuidV4(),
          path: url.pathname,
          url: url.toString(),
          contentType: input.type,
          userId: session.user.id
        })
        .returning()

      return photo[0]
    }),
  listFiles: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx
    const result = await db.query.files.findMany({
      where: (files, { eq }) => eq(files.userId, session.user.id),
      orderBy: [desc(files.createdAt)]
    })

    return result
  })
})
