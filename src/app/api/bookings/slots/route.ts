import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date) return NextResponse.json({ bookedSlots: [] })
  const { data } = await supabaseAdmin()
    .from('bookings')
    .select('booking_time')
    .eq('booking_date', date)
    .neq('status', 'cancelled')
  return NextResponse.json({ bookedSlots: (data || []).map((b: any) => b.booking_time) })
}
