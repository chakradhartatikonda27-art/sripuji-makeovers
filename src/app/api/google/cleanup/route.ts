import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { deleteCalendarEvent } from '@/lib/googleCalendar'
import { syncBlockedDateToCalendar } from '@/lib/googleCalendarHelper'

export const dynamic = 'force-dynamic'

async function getValidAccessToken(): Promise<string | null> {
  const sb = supabaseAdmin()
  const { data } = await sb.from('site_settings')
    .select('key, value')
    .in('key', ['google_access_token', 'google_refresh_token', 'google_token_expiry'])

  if (!data?.length) return null
  const settings: Record<string, string> = {}
  data.forEach((d: any) => { settings[d.key] = d.value })

  const expiry       = parseInt(settings.google_token_expiry || '0')
  const accessToken  = settings.google_access_token
  const refreshToken = settings.google_refresh_token

  if (!refreshToken) return null

  if (!accessToken || Date.now() > expiry - 5 * 60 * 1000) {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id:     process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type:    'refresh_token',
      }),
    })
    const tokens = await res.json()
    if (tokens.access_token) {
      await sb.from('site_settings').upsert([
        { key: 'google_access_token', value: tokens.access_token },
        { key: 'google_token_expiry', value: String(Date.now() + tokens.expires_in * 1000) },
      ])
      return tokens.access_token
    }
    return null
  }
  return accessToken
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sb = supabaseAdmin()
  const accessToken = await getValidAccessToken()
  if (!accessToken) return NextResponse.json({ error: 'No Google token' }, { status: 500 })

  // Get all pending deletions
  const { data: deletions } = await sb
    .from('deleted_calendar_events')
    .select('*')
    .order('deleted_at')

  const results = { deleted: 0, failed: 0 }

  for (const d of deletions || []) {
    try {
      await deleteCalendarEvent(accessToken, d.google_event_id)
      await sb.from('deleted_calendar_events').delete().eq('id', d.id)
      results.deleted++
    } catch (e) {
      console.error('Failed to delete calendar event:', d.google_event_id, e)
      results.failed++
    }
  }

  return NextResponse.json({ success: true, ...results })
}
