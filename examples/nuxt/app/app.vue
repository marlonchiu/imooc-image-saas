<template>
  <div>Hello World</div>
</template>

<script setup>
import { createOpenApiClient } from '@imooc-image-saas/api'
import { onMounted } from 'vue'

onMounted(async () => {
  const tokenResp = await fetch('/api/test')
  const token = await tokenResp.text()

  const apiClient = createOpenApiClient({ signedToken: token })

  const res = await apiClient.file.createPresignedUrl.mutate({
    filename: 'Screenshot 2023-06-20 200151.png',
    contentType: 'image/png',
    size: 34105,
    appId: 'c52963e1-dfa2-4e70-8333-04de2dcbbb4b'
  })
  console.log(res)
})
</script>
