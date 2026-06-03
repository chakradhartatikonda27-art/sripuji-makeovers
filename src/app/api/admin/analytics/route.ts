import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const sb = supabaseAdmin()
  const [{ data: monthly }, { data: allBk }] = await Promise.all([
    sb.from('booking_summary').select('*').limit(6),
    sb.from('bookings').select('service,service_price,status'),
  ])
  const svcMap: Record<string, number> = {}
  allBk?.forEach((b: any) => { svcMap[b.service] = (svcMap[b.service] || 0) + 1 })
  const topServices = Object.entries(svcMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }))
  const totalRevenue = allBk?.filter((b: any) => b.status === 'completed').reduce((s: number, b: any) => s + (b.service_price || 0), 0) || 0
  return NextResponse.json({ monthly: monthly || [], topServices, totalRevenue, totalBookings: allBk?.length || 0 })
}
