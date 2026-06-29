import { NextRequest, NextResponse } from 'next/server'
import { getAuthUrl } from '@/lib/googleCalendar'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  if (!await verifyAdminAuth(req)) return unauthorizedResponse()
  const url = getAuthUrl()
  return NextResponse.redirect(url)
}
