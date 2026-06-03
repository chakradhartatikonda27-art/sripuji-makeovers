import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

async function generateRef(sb: ReturnType<typeof supabaseAdmin>) {
  const { count } = await sb.from('bookings').select('*', { count: 'exact', head: true })
  return `SP-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(4, '0')}`
}

export async function POST(req: NextRequest) {
  const sb   = supabaseAdmin()
  const body = await req.json()
  const { name, phone, email, service, service_price, booking_date, booking_time, event_date, venue, notes } = body

  if (!name || !phone || !service || !booking_date || !booking_time)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  const { data: blk } = await sb.from('blocked_dates').select('id').eq('blocked_date', booking_date).maybeSingle()
  if (blk) return NextResponse.json({ error: 'This date is unavailable. Please choose another date.' }, { status: 409 })

  const { data: existing } = await sb.from('bookings').select('id').eq('booking_date', booking_date).eq('booking_time', booking_time).neq('status', 'cancelled').maybeSingle()
  if (existing) return NextResponse.json({ error: 'This time slot is already booked. Please choose another time.' }, { status: 409 })

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
    event_date: event_date || null,
    venue: venue || null,
    notes: notes || null,
    status: 'confirmed',
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
