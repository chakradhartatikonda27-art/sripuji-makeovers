import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin().from('blocked_dates').select('*').order('blocked_date')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { date, reason } = await req.json()
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })
  const { data, error } = await supabaseAdmin().from('blocked_dates').insert({ blocked_date: date, reason: reason || 'Unavailable' }).select().single()
  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Already blocked' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true, data }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { date } = await req.json()
  const { error } = await supabaseAdmin().from('blocked_dates').delete().eq('blocked_date', date)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
