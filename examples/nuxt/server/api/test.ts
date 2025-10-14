// import { createOpenApiClient } from '@imooc-image-saas/api'
import jwt from 'jsonwebtoken'

const apiKey = '7ab720dd-4774-4fc4-99fe-74795468b3d6'
const clientId = "bce5d3d2-9e02-4229-b539-1279f8ab58d3";

export default defineEventHandler(async (event) => {

  // 用 apiKey 加密 payload
  const token = jwt.sign(
    {
      filename: '1.png',
      contentType: 'image/png',
      size: 43693,
      appId: 'e760dcd4-aac4-4709-a7e9-0f07bc98654d',
      clientId
    },
    apiKey,
    {
      expiresIn: '10m'
    }
  )

  return token

  // const apiClient = createOpenApiClient({ apiKey })
  // const response = await apiClient.file.createPresignedUrl.mutate({
  //   filename: '1.png',
  //   contentType: 'image/png',
  //   size: 43693,
  //   appId: 'e760dcd4-aac4-4709-a7e9-0f07bc98654d'
  // })

  // return response
})
