import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, phone } = body
  if (!name || !phone) return NextResponse.json({ error: 'name and phone required' }, { status: 400 })
  const { error } = await supabaseAdmin().from('contact_messages').insert({
    name, phone, email: body.email || null, service: body.service || null,
    event_date: body.event_date || null, venue: body.venue || null, message: body.message || null,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, message: 'Message received! Sri Pujitha will contact you within 24 hours.' }, { status: 201 })
}
