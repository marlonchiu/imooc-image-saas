import db from '@/server/db/db'
import { NextResponse, type NextRequest } from 'next/server'
import { S3Client, GetObjectCommand, GetObjectCommandInput, S3ClientConfig } from '@aws-sdk/client-s3'
import sharp from 'sharp'

const { COS_APP_ID, COS_APP_SECRET, COS_APP_BUCKET, COS_APP_API_ENDPOINT, COS_APP_REGION } = process.env

export async function GET(request: NextRequest, { params: { id } }: { params: { id: string } }) {
  const file = await db.query.files.findFirst({
    where: (files, { eq }) => eq(files.id, id)
  })

  if (!file || !file.contentType.startsWith('image')) {
    return new NextResponse('', {
      status: 400
    })
  }

  const params: GetObjectCommandInput = {
    Bucket: COS_APP_BUCKET,
    Key: file.path
  }

  const s3Client = new S3Client({
    endpoint: COS_APP_API_ENDPOINT,
    region: COS_APP_REGION,
    credentials: {
      accessKeyId: COS_APP_ID,
      secretAccessKey: COS_APP_SECRET
    }
  } as S3ClientConfig)

  const command = new GetObjectCommand(params)
  const response = await s3Client.send(command)

  // ----------> sharp

  const byteArray = await response.Body?.transformToByteArray()
  if (!byteArray) {
    return new NextResponse('', {
      status: 400
    })
  }

  const image = sharp(byteArray)

  image.resize({
    width: 250,
    height: 250
  })

  const buffer = await image.webp().toBuffer()

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  })
}
