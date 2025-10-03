// import { NextRequest, NextResponse } from 'next/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// export const dynamic = 'force-dynamic'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function GET(request: NextRequest) {
  // console.log('🚀 ~ GET ~ request:', request)
  console.log('------》')
  console.log(cookies().get('next-auth.session-token'));
  // return new Response('Hello World')
  // return Response.json({ message: 'Hello World' })
  return NextResponse.json({ message: 'Hello World' })
}
