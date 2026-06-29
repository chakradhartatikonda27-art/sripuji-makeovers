import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function verifyAdminAuth(req: NextRequest): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  return token?.value === 'authenticated'
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
