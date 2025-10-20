<template>
  <!-- <div ref="containerRef">Hello World</div> -->
  <div>
    <VueUploadButton> 点一下上传 </VueUploadButton>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { createOpenApiClient } from '@imooc-image-saas/api'
import { UploadButton } from '@imooc-image-saas/upload-button'
import { connect } from '@imooc-image-saas/preact-vue-connect'

const VueUploadButton = connect(UploadButton)
// import { render, h } from 'preact'

// const containerRef = ref(null)
// watchEffect(() => {
//   if (containerRef.value) {
//     render(h(UploadButton, { onClick: () => console.log('click') }), containerRef.value)
//   }
// })

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
