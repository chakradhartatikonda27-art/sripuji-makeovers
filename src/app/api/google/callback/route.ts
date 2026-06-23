import { NextRequest, NextResponse } from 'next/server'
import { getTokens } from '@/lib/googleCalendar'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const code  = req.nextUrl.searchParams.get('code')
  const error = req.nextUrl.searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect('https://sripuji-makeovers-eight.vercel.app/admin?error=google_auth_failed')
  }

  try {
    const tokens = await getTokens(code)
    const sb = supabaseAdmin()
    await sb.from('site_settings').upsert([
      { key: 'google_access_token',  value: tokens.access_token },
      { key: 'google_refresh_token', value: tokens.refresh_token },
      { key: 'google_token_expiry',  value: String(Date.now() + tokens.expires_in * 1000) },
    ])
    return NextResponse.redirect('https://sripuji-makeovers-eight.vercel.app/admin?success=google_connected')
  } catch (e) {
    console.error('Google OAuth error:', e)
    return NextResponse.redirect('https://sripuji-makeovers-eight.vercel.app/admin?error=google_auth_failed')
  }
}
