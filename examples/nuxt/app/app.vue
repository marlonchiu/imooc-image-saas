<template>
  <div>
    <VueUploadButton :onFileUploaded="onFileUploaded" :uploader="uploader"> 点一下上传 </VueUploadButton>
    <img :src="uploaded" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createOpenApiClient } from '@imooc-image-saas/api'
import { UploadButtonWithUploader } from '@imooc-image-saas/upload-button'
import { connect } from '@imooc-image-saas/preact-vue-connect'
import { createUploader } from '@imooc-image-saas/uploader'

const VueUploadButton = connect(UploadButtonWithUploader)

const uploader = createUploader(async (file) => {
  const tokenResp = await fetch('/api/test')
  const token = await tokenResp.text()

  const apiClient = createOpenApiClient({ signedToken: token })

  return apiClient.file.createPresignedUrl.mutate({
    filename: file.data instanceof File ? file.data.name : 'test',
    contentType: file.data.type || '',
    size: file.size
  })
})

const uploaded = ref('')

function onFileUploaded(url) {
  uploaded.value = url
}
</script>
