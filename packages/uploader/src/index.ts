import Uppy, { UppyFile } from '@uppy/core'
import AwsS3, { type AwsS3UploadParameters } from '@uppy/aws-s3'

export function createUploader(getUploadParameters: (file: UppyFile<Record<string, unknown>, Record<string, unknown>>) => Promise<AwsS3UploadParameters>) {
  const uppy = new Uppy()
  uppy.use(AwsS3, {
    shouldUseMultipart: false,
    getUploadParameters: getUploadParameters
  })

  return uppy
}
