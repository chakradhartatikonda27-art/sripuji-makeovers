import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const updates: Record<string, unknown> = {}
  if (body.status        !== undefined) updates.status        = body.status
  if (body.advance_paid  !== undefined) updates.advance_paid  = body.advance_paid
  if (body.booking_time  !== undefined) updates.booking_time  = body.booking_time
  if (body.venue         !== undefined) updates.venue         = body.venue
  if (body.notes         !== undefined) updates.notes         = body.notes
  if (body.booking_date  !== undefined) updates.booking_date  = body.booking_date
  updates.updated_at = new Date().toISOString()
  const { data, error } = await supabaseAdmin()
    .from('bookings').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, booking: data })
}
