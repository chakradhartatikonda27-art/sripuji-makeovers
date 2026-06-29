import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/adminAuth'

export async function GET() {
  const sb = supabaseAdmin()
  const { data } = await sb.from('site_settings').select('value').eq('key', 'hero_gallery').single()
  try { return NextResponse.json(JSON.parse(data?.value || '[]')) }
  catch { return NextResponse.json([]) }
}

export async function POST(req: NextRequest) {
  if (!await verifyAdminAuth(req)) return unauthorizedResponse()
  const sb = supabaseAdmin()
  const form = await req.formData()
  const file = form.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  const ext = file.name.split('.').pop()
  const path = `hero/${Date.now()}.${ext}`
  const buf = Buffer.from(await file.arrayBuffer())
  const { error: upErr } = await sb.storage.from('portfolio').upload(path, buf, { contentType: file.type, upsert: true })
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
  const { data: { publicUrl: rawUrl } } = sb.storage.from('portfolio').getPublicUrl(path)
  const publicUrl = rawUrl.replace('bdudqnctoynjtihjskph.supabase.co', 'bdudqnctoynjtihJskph.supabase.co')
  const { data: existing } = await sb.from('site_settings').select('value').eq('key', 'hero_gallery').single()
  const current = JSON.parse(existing?.value || '[]')
  current.push(publicUrl)
  await sb.from('site_settings').upsert({ key: 'hero_gallery', value: JSON.stringify(current) })
  return NextResponse.json({ url: publicUrl }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  if (!await verifyAdminAuth(req)) return unauthorizedResponse()
  const { url } = await req.json()
  const sb = supabaseAdmin()
  const { data: existing } = await sb.from('site_settings').select('value').eq('key', 'hero_gallery').single()
  const current = JSON.parse(existing?.value || '[]')
  const updated = current.filter((u: string) => u !== url)
  await sb.from('site_settings').upsert({ key: 'hero_gallery', value: JSON.stringify(updated) })
  return NextResponse.json({ success: true })
}
