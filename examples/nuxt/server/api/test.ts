const apiKey = 'a906cf2f-b362-4db3-b3e1-1efc32e70017'

export default defineEventHandler((event) => {
  const url = 'http://localhost:3000/api/open/file.createPresignedUrl?batch=1'

  const payload = {
    '0': { filename: '1.png', contentType: 'image/png', size: 43693, appId: 'e760dcd4-aac4-4709-a7e9-0f07bc98654d' }
  }

  return fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify(payload)
  })
})
