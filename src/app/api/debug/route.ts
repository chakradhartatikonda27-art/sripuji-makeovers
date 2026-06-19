import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING',
    anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
    service_key: process.env.SUPABASE_SERVICE_KEY ? 'SET' : 'MISSING',
    admin_password: process.env.ADMIN_PASSWORD ? 'SET' : 'MISSING',
    node_env: process.env.NODE_ENV,
  })
}
