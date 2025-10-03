// import { NextRequest, NextResponse } from 'next/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

import * as z from 'zod'
import { error } from 'console'

const inputSchema = z.object({
  name: z.string().max(20).min(3),
  email: z.email()
})

// export const dynamic = 'force-dynamic'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function GET(request: NextRequest) {
  console.log('🚀 ~ GET ~ request:', request)
  const query = request.nextUrl.searchParams
  console.log('🚀 ~ GET ~ query:', query)
  const name = query.get('name')
  const email = query.get('email')
  console.log('🚀 ~ GET ~ name:', name)
  console.log('🚀 ~ GET ~ email:', email)

  // try {
  //   const result = inputSchema.parse({ name, email })
  //   console.log('🚀 ~ GET ~ result:', result)
  //   return NextResponse.json(result)
  // } catch (error) {
  //   console.log('🚀 ~ GET ~ error:', error)
  //   return NextResponse.json({ error }, { status: 400 })
  // }

  const result = inputSchema.safeParse({ name, email })
  console.log('🚀 ~ GET ~ result:', result)
  if (result.success) {
    return NextResponse.json(result.data)
  } else {
    return NextResponse.json({ error: result.error.format() }, { status: 400 })
  }

  // console.log('------》')
  // console.log(cookies().get('next-auth.session-token'))
  // return new Response('Hello World')
  // return Response.json({ message: 'Hello World' })
  // return NextResponse.json({ message: 'Hello World' })
}
