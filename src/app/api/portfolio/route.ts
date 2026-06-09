import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from('portfolio_items')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { label, category, image_url, is_tall, sort_order } = body
  if (!label || !category || !image_url)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  const { data, error } = await supabaseAdmin()
    .from('portfolio_items')
    .insert({ label, category, image_url, is_tall: is_tall || false, sort_order: sort_order || 0 })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { id, image_url } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const { error } = await supabaseAdmin()
    .from('portfolio_items')
    .delete()
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (image_url) {
    const path = image_url.split('/portfolio/')[1]
    if (path) await supabaseAdmin().storage.from('portfolio').remove([path])
  }
  return NextResponse.json({ success: true })
}
