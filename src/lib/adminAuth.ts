import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function verifyAdminAuth(req: NextRequest): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === process.env.ADMIN_PASSWORD
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
