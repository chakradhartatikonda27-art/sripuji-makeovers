import { supabaseAdmin } from '@/lib/supabase'
import { refreshAccessToken, createCalendarEvent, deleteCalendarEvent, createBlockedEvent } from '@/lib/googleCalendar'

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
    const tokens = await refreshAccessToken(refreshToken)
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

export async function syncBookingToCalendar(booking: any, action: 'create' | 'delete') {
  try {
    const accessToken = await getValidAccessToken()
    if (!accessToken) return null

    if (action === 'create') {
      const event = await createCalendarEvent(accessToken, booking)
      if (event.id) {
        await supabaseAdmin().from('bookings').update({ google_event_id: event.id }).eq('id', booking.id)
      }
      return event
    } else {
      if (booking.google_event_id) {
        await deleteCalendarEvent(accessToken, booking.google_event_id)
      }
    }
  } catch (e) {
    console.error('Google Calendar sync error:', e)
  }
  return null
}

export async function syncBlockedDateToCalendar(date: string, action: 'create' | 'delete') {
  try {
    const accessToken = await getValidAccessToken()
    if (!accessToken) return null
    if (action === 'create') return await createBlockedEvent(accessToken, date)
  } catch (e) {
    console.error('Google Calendar blocked date sync error:', e)
  }
  return null
}
