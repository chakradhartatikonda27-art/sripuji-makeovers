import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })
  const { data, error } = await supabaseAdmin()
    .from('bookings').select('booking_time').eq('booking_date', date).neq('status', 'cancelled')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ bookedSlots: (data || []).map((b: any) => b.booking_time) })
}
