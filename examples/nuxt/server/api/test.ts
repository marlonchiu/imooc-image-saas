// import { createOpenApiClient } from '@imooc-image-saas/api'
import jwt from 'jsonwebtoken'

const apiKey = 'a116c5e9-9bdd-4c8e-a757-7b3511a5938a'
const clientId = '79628fb3-7eca-4ad1-a608-cba663f66c17'
const appId = '9941d4a3-a643-41d8-9c73-c07296255458'

export default defineEventHandler(async (event) => {
  // 用 apiKey 加密 payload
  const token = jwt.sign(
    {
      filename: '1.png',
      contentType: 'image/png',
      size: 43693,
      appId,
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
