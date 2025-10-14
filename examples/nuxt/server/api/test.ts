import { createOpenApiClient } from '@imooc-image-saas/api'

const apiKey = 'a906cf2f-b362-4db3-b3e1-1efc32e70017'

export default defineEventHandler(async (event) => {
  const apiClient = createOpenApiClient({ apiKey })

  const response = await apiClient.file.createPresignedUrl.mutate({
    filename: '1.png',
    contentType: 'image/png',
    size: 43693,
    appId: 'e760dcd4-aac4-4709-a7e9-0f07bc98654d'
  })

  return response
})
