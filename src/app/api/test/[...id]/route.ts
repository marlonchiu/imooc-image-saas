import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function GET(request: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('------》 id', id)
  return NextResponse.json({ id: id })
}
