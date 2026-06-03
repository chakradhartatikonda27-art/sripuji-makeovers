import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body    = await req.json()
  const updates: Record<string, unknown> = {}
  if (body.status       !== undefined) updates.status       = body.status
  if (body.advance_paid !== undefined) updates.advance_paid = body.advance_paid
  const { data, error } = await supabaseAdmin().from('bookings').update(updates).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, booking: data })
}
