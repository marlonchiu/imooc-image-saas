'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { type S3StorageConfiguration } from '@/server/db/schema'
import { trpcClientReact } from '@/utils/api'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export type CreateStorageForm = S3StorageConfiguration & { name: string }
export default function CreateStoragePage({ params: { id } }: { params: { id: string } }) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateStorageForm>()

  const { mutate, isPending } = trpcClientReact.storages.createStorage.useMutation({
    onSuccess: () => {
      router.push(`/dashboard/apps/${id}/setting/storage`)
    },
    onError: (error) => {
      toast(error.message)
    }
  })

  const onSubmit: SubmitHandler<CreateStorageForm> = (data) => {
    console.log('create storage submit', data)
    mutate(data)
  }
  return (
    <div className="pt-10 ">
      <h1 className="text-3xl mb-6 max-w-md mx-auto">Create Storage</h1>
      <form className="flex flex-col gap-4 max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>Name</Label>
          <Input {...register('name', { required: true, minLength: 3 })} />
          <span className="text-red-500">{errors.name?.message}</span>
        </div>

        <div>
          <Label>Bucket</Label>
          <Input {...register('bucket', { required: 'Bucket is required' })} />
          <span className="text-red-500">{errors.bucket?.message}</span>
        </div>

        <div>
          <Label>AccessKeyId</Label>
          <Input {...register('accessKeyId', { required: 'AccessKeyId is required' })} />
          <span className="text-red-500">{errors.accessKeyId?.message}</span>
        </div>

        <div>
          <Label>SecretAccessKey</Label>
          <Input type="password" {...register('secretAccessKey', { required: 'SecretAccessKey is required' })} />
          <span className="text-red-500">{errors.secretAccessKey?.message}</span>
        </div>

        <div>
          <Label>Region</Label>
          <Input {...register('region', { required: 'Region is required' })} />
          <span className="text-red-500">{errors.region?.message}</span>
        </div>
        <div>
          <Label>ApiEndpoint</Label>
          <Input
            {...register('apiEndpoint', {
              required: 'ApiEndpoint is required'
            })}
          />
          <span className="text-red-500">{errors.apiEndpoint?.message}</span>
        </div>
        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
    </div>
  )
}
