import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { syncBookingToCalendar, syncBlockedDateToCalendar } from '@/lib/googleCalendarHelper'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sb = supabaseAdmin()
  const results = { bookings: { synced: 0, failed: 0 }, blocked: { synced: 0, failed: 0 } }

  // Sync all confirmed/pending bookings from June + July
  const { data: bookings } = await sb.from('bookings')
    .select('*')
    .in('status', ['confirmed', 'pending'])
    .gte('booking_date', '2026-06-01')
    .lte('booking_date', '2026-07-31')
    .is('google_event_id', null)
    .order('booking_date')


  for (const bk of bookings || []) {
    try {
      await syncBookingToCalendar(bk, 'create')
      results.bookings.synced++
    } catch (e) {
      console.error(`Failed to sync booking ${bk.id}:`, e)
      results.bookings.failed++
    }
  }

  // Sync all blocked dates from June + July
  const { data: blockedDates } = await sb.from('blocked_dates')
    .select('*')
    .gte('blocked_date', '2026-06-01')
    .lte('blocked_date', '2026-07-31')
    .is('google_event_id', null)


  for (const bd of blockedDates || []) {
    try {
      await syncBlockedDateToCalendar(bd.blocked_date, 'create')
      results.blocked.synced++
    } catch (e) {
      console.error(`Failed to sync blocked date ${bd.blocked_date}:`, e)
      results.blocked.failed++
    }
  }

  return NextResponse.json({ success: true, results })
}
