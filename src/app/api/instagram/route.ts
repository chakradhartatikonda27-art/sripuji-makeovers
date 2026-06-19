export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const token  = process.env.INSTAGRAM_ACCESS_TOKEN
    const userId = process.env.INSTAGRAM_USER_ID

    if (!token || !userId) {
      return NextResponse.json({ error: 'Instagram not configured', token: !!token, userId: !!userId, env: Object.keys(process.env).filter(k=>k.includes('INSTAGRAM')) }, { status: 500 })
    }

    const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp'
    const url    = `https://graph.instagram.com/v21.0/${userId}/media?fields=${fields}&limit=12&access_token=${token}`

    const res  = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data.data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
