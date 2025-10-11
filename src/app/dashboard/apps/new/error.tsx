'use client'

import { Button } from '@/components/ui/button'

export default function CreateAppError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <div className="w-64 mx-auto p-8 flex flex-col justify-center items-center">
        <span>Create App Failed</span>
        <Button className='mt-4' onClick={reset}>Reset</Button>
      </div>
    </div>
  )
}
