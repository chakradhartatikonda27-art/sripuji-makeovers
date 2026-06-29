import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/adminAuth'

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from('site_settings').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const settings: Record<string, string> = {}
  ;(data || []).forEach((r: any) => { settings[r.key] = r.value })
  return NextResponse.json(settings)
}

export async function POST(req: NextRequest) {
  if (!await verifyAdminAuth(req)) return unauthorizedResponse()
  const body = await req.json()
  const updates = Object.entries(body).map(([key, value]) => ({ key, value: String(value), updated_at: new Date().toISOString() }))
  const { error } = await supabaseAdmin()
    .from('site_settings').upsert(updates, { onConflict: 'key' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
