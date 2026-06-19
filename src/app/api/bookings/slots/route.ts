import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const TIME_SLOTS = [
  '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
  '6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM'
]

function getBlockedSlots(startTime: string, endTime: string): string[] {
  const startIdx = TIME_SLOTS.indexOf(startTime)
  const endIdx   = TIME_SLOTS.indexOf(endTime)
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return [startTime]
  return TIME_SLOTS.slice(startIdx, endIdx)
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date) return NextResponse.json({ bookedSlots: [] })

  const { data } = await supabaseAdmin()
    .from('bookings')
    .select('booking_time, start_time, end_time')
    .eq('booking_date', date)
    .neq('status', 'cancelled')

  const bookedSlots = new Set<string>()
  for (const bk of data || []) {
    const start = bk.start_time || bk.booking_time
    const slots = bk.end_time ? getBlockedSlots(start, bk.end_time) : [bk.booking_time]
    slots.forEach(s => bookedSlots.add(s))
  }

  return NextResponse.json({ bookedSlots: Array.from(bookedSlots) })
}
