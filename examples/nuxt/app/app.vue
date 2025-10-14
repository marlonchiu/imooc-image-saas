<template>
  <div>Hello World</div>
</template>

<script setup>
import { createOpenApiClient } from '@imooc-image-saas/api'
import { onMounted } from 'vue'

const apiKey = 'asd' // 假的模拟的api key
const apiClient = createOpenApiClient({ apiKey })

onMounted(() => {
  apiClient.file.createPresignedUrl.mutate({
    filename: 'Screenshot 2023-06-20 200151.png',
    contentType: 'image/png',
    size: 34105,
    appId: 'c52963e1-dfa2-4e70-8333-04de2dcbbb4b'
  })
})
</script>
