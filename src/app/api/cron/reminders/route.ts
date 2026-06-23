import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendWhatsAppMessage, WA_MESSAGES } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sb  = supabaseAdmin()
  const now = new Date()
  const today    = now.toISOString().split('T')[0]
  const in1Day   = new Date(now); in1Day.setDate(in1Day.getDate() + 1)
  const in5Days  = new Date(now); in5Days.setDate(in5Days.getDate() + 5)
  const d1 = in1Day.toISOString().split('T')[0]
  const d5 = in5Days.toISOString().split('T')[0]
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1)
  const yd = yesterday.toISOString().split('T')[0]

  const results = { sent: 0, failed: 0 }

  // 5-day reminders
  const { data: bks5 } = await sb.from('bookings').select('*').eq('booking_date', d5).eq('status', 'confirmed')
  for (const bk of bks5 || []) {
    try {
      await sendWhatsAppMessage(bk.phone, WA_MESSAGES.reminder5Days(bk.name, bk.booking_date, bk.booking_time, bk.service))
      results.sent++
    } catch { results.failed++ }
  }

  // 1-day reminders
  const { data: bks1 } = await sb.from('bookings').select('*').eq('booking_date', d1).eq('status', 'confirmed')
  for (const bk of bks1 || []) {
    try {
      await sendWhatsAppMessage(bk.phone, WA_MESSAGES.reminder1Day(bk.name, bk.booking_date, bk.booking_time, bk.venue || ''))
      results.sent++
    } catch { results.failed++ }
  }

  // Event day
  const { data: bksToday } = await sb.from('bookings').select('*').eq('booking_date', today).eq('status', 'confirmed')
  for (const bk of bksToday || []) {
    try {
      await sendWhatsAppMessage(bk.phone, WA_MESSAGES.reminderEventDay(bk.name, bk.booking_time))
      results.sent++
    } catch { results.failed++ }
  }

  // Post service
  const { data: bksYd } = await sb.from('bookings').select('*').eq('booking_date', yd).eq('status', 'confirmed')
  for (const bk of bksYd || []) {
    try {
      await sendWhatsAppMessage(bk.phone, WA_MESSAGES.postService(bk.name))
      await sb.from('bookings').update({ status: 'completed' }).eq('id', bk.id)
      results.sent++
    } catch { results.failed++ }
  }

  return NextResponse.json({ success: true, ...results })
}
