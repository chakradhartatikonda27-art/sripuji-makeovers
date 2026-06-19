import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const TIME_SLOTS = [
  '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
  '6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM'
]

function getBlockedSlots(startTime: string, endTime: string): string[] {
  const startIdx = TIME_SLOTS.indexOf(startTime)
  const endIdx   = TIME_SLOTS.indexOf(endTime)
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return [startTime]
  // Block all slots from start up to (not including) end
  return TIME_SLOTS.slice(startIdx, endIdx)
}

async function generateRef(sb: ReturnType<typeof supabaseAdmin>) {
  const { count } = await sb.from('bookings').select('*', { count: 'exact', head: true })
  return `SP-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(4, '0')}`
}

export async function POST(req: NextRequest) {
  const sb   = supabaseAdmin()
  const body = await req.json()
  const { name, phone, email, service, service_price, booking_date, booking_time, end_time, event_date, venue, notes } = body

  if (!name || !phone || !service || !booking_date || !booking_time)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  // Check blocked dates
  const { data: blk } = await sb.from('blocked_dates').select('id').eq('blocked_date', booking_date).maybeSingle()
  if (blk) return NextResponse.json({ error: 'This date is blocked. Please choose another date.' }, { status: 409 })

  // Get all slots this booking will occupy
  const slotsToBook = end_time ? getBlockedSlots(booking_time, end_time) : [booking_time]

  // Check if ANY of these slots are already taken
  const { data: existing } = await sb.from('bookings')
    .select('id, booking_time, start_time, end_time, status')
    .eq('booking_date', booking_date)
    .neq('status', 'cancelled')

  const bookedSlots = new Set<string>()
  for (const bk of existing || []) {
    const slots = bk.end_time ? getBlockedSlots(bk.start_time || bk.booking_time, bk.end_time) : [bk.booking_time]
    slots.forEach(s => bookedSlots.add(s))
  }

  const conflict = slotsToBook.find(s => bookedSlots.has(s))
  if (conflict) {
    return NextResponse.json({ 
      error: `Time slot ${conflict} is already booked. Please choose another time.`
    }, { status: 409 })
  }

  let price = service_price
  if (!price) {
    const { data: svc } = await sb.from('services').select('price').eq('name', service).maybeSingle()
    price = svc?.price || 0
  }

  const booking_ref = await generateRef(sb)
  const { data, error } = await sb.from('bookings').insert({
    booking_ref, name, phone, email: email || null,
    service, service_price: price,
    booking_date, booking_time,
    start_time: booking_time,
    end_time: end_time || null,
    event_date: event_date || null,
    venue: venue || null,
    notes: notes || null,
    status: body.admin_override ? 'confirmed' : 'pending',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, booking: data }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const sb     = supabaseAdmin()
  const status = req.nextUrl.searchParams.get('status')
  let query    = sb.from('bookings').select('*', { count: 'exact' }).order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, total: count })
}
