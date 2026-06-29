import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  if (!await verifyAdminAuth(req)) return unauthorizedResponse()
  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  const ext      = file.name.split('.').pop()
  const filename = `about-photo.${ext}`
  const buffer   = await file.arrayBuffer()
  const { error } = await supabaseAdmin()
    .storage.from('portfolio')
    .upload(filename, buffer, { contentType: file.type, upsert: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const { data } = supabaseAdmin().storage.from('portfolio').getPublicUrl(filename)
  await supabaseAdmin().from('site_settings')
    .upsert({ key: 'about_photo_url', value: data.publicUrl }, { onConflict: 'key' })
  return NextResponse.json({ success: true, url: data.publicUrl })
}
