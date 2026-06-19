import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref')
  if (!ref) return NextResponse.json({ error: 'Missing booking ref' }, { status: 400 })

  const { data, error } = await supabaseAdmin()
    .from('bookings')
    .select('*')
    .eq('booking_ref', ref.toUpperCase())
    .single()

  if (error || !data) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  return NextResponse.json({ booking: data })
}
