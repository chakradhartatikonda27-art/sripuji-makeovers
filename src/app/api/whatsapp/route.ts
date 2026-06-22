import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendWhatsAppMessage, WA_MESSAGES } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
const ARTIST_PHONE = '918885397517'

const TIME_SLOTS = [
  '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
  '6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM'
]

export async function GET(req: NextRequest) {
  const mode      = req.nextUrl.searchParams.get('hub.mode')
  const token     = req.nextUrl.searchParams.get('hub.verify_token')
  const challenge = req.nextUrl.searchParams.get('hub.challenge')
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function POST(req: NextRequest) {
  try {
    const body     = await req.json()
    const messages = body.entry?.[0]?.changes?.[0]?.value?.messages
    if (!messages?.length) return NextResponse.json({ status: 'ok' })

    const message = messages[0]
    const from    = message.from
    const text    = message.text?.body?.trim().toLowerCase() || ''
    const sb      = supabaseAdmin()
    const now     = new Date()
    const today   = now.toISOString().split('T')[0]
    let reply     = ''

    // Artist check - log for debugging
    console.log('Message from:', from, 'Artist phone:', ARTIST_PHONE)

    // TODAY
    if (text === 'today' || text === 'aaj') {
      const { data: bks } = await sb.from('bookings').select('*')
        .eq('booking_date', today).neq('status', 'cancelled').order('booking_time')
      if (!bks?.length) {
        reply = `📅 *Today - ${today}*\n\n🟢 No bookings today! Fully free.`
      } else {
        reply = `📅 *Today - ${today}* (${bks.length} booking${bks.length>1?'s':''})\n\n`
        bks.forEach((b, i) => {
          reply += `${i+1}. ⏰ ${b.booking_time}\n   👤 ${b.name}\n   💄 ${b.service}\n   📱 ${b.phone}\n   ${b.status==='confirmed'?'✅':'⏳'} ${b.status.toUpperCase()}\n\n`
        })
      }
    }

    // TOMORROW
    else if (text === 'tomorrow' || text === 'kal') {
      const tmr = new Date(now); tmr.setDate(tmr.getDate()+1)
      const tDate = tmr.toISOString().split('T')[0]
      const { data: bks } = await sb.from('bookings').select('*')
        .eq('booking_date', tDate).neq('status', 'cancelled').order('booking_time')
      if (!bks?.length) {
        reply = `📅 *Tomorrow - ${tDate}*\n\n🟢 No bookings! Fully available.`
      } else {
        reply = `📅 *Tomorrow - ${tDate}* (${bks.length} booking${bks.length>1?'s':''})\n\n`
        bks.forEach((b,i) => {
          reply += `${i+1}. ⏰ ${b.booking_time} - ${b.name}\n   💄 ${b.service} | 📱 ${b.phone}\n\n`
        })
      }
    }

    // WEEK
    else if (text === 'week') {
      reply = `📅 *This Week Overview*\n\n`
      for (let i=0; i<7; i++) {
        const d = new Date(now); d.setDate(d.getDate()+i)
        const ds = d.toISOString().split('T')[0]
        const day = d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' })
        const { data: bks } = await sb.from('bookings').select('id').eq('booking_date', ds).neq('status','cancelled')
        const { data: blk } = await sb.from('blocked_dates').select('id').eq('blocked_date', ds).maybeSingle()
        if (blk) reply += `🔴 ${day} — Blocked\n`
        else if (!bks?.length) reply += `🟢 ${day} — Free\n`
        else reply += `🟡 ${day} — ${bks.length} booking${bks.length>1?'s':''}\n`
      }
    }

    // PENDING
    else if (text === 'pending') {
      const { data: bks } = await sb.from('bookings').select('*').eq('status','pending').order('booking_date')
      if (!bks?.length) {
        reply = `✅ No pending bookings!`
      } else {
        reply = `⏳ *Pending Bookings (${bks.length})*\n\n`
        bks.forEach((b,i) => {
          reply += `${i+1}. ${b.name}\n   📅 ${b.booking_date} ⏰ ${b.booking_time}\n   💄 ${b.service}\n   📱 ${b.phone}\n\n`
        })
        reply += `Reply:\n✅ *accept 1* — Confirm\n❌ *reject 1* — Cancel`
      }
    }

    // ACCEPT
    else if (text.startsWith('accept ')) {
      const num = parseInt(text.split(' ')[1]) - 1
      const { data: bks } = await sb.from('bookings').select('*').eq('status','pending').order('booking_date')
      if (bks?.[num]) {
        const b = bks[num]
        await sb.from('bookings').update({ status:'confirmed' }).eq('id', b.id)
        reply = `✅ *Confirmed!*\n\n${b.name}\n📅 ${b.booking_date} ⏰ ${b.booking_time}\n💄 ${b.service}\n📱 ${b.phone}`
        try {
          await sendWhatsAppMessage(b.phone, WA_MESSAGES.bookingConfirmed(b.name, b.booking_date, b.booking_time, b.service, b.booking_ref))
          reply += `\n\n✅ Customer notified on WhatsApp!`
        } catch { reply += `\n\n⚠️ Could not notify customer` }
      } else {
        reply = `❌ Booking #${num+1} not found.\nType *pending* to see list.`
      }
    }

    // REJECT
    else if (text.startsWith('reject ')) {
      const num = parseInt(text.split(' ')[1]) - 1
      const { data: bks } = await sb.from('bookings').select('*').eq('status','pending').order('booking_date')
      if (bks?.[num]) {
        const b = bks[num]
        await sb.from('bookings').update({ status:'cancelled' }).eq('id', b.id)
        reply = `❌ *Rejected*\n\n${b.name}\n📅 ${b.booking_date} ⏰ ${b.booking_time}`
        try {
          await sendWhatsAppMessage(b.phone, WA_MESSAGES.bookingRejected(b.name, b.booking_date, b.booking_time))
          reply += `\n\n✅ Customer notified!`
        } catch { reply += `\n\n⚠️ Could not notify customer` }
      } else {
        reply = `❌ Booking #${num+1} not found.\nType *pending* to see list.`
      }
    }

    // BLOCK DATE
    else if (text.startsWith('block ')) {
      const parts = text.replace('block ','').trim().split(' ')
      const day = parseInt(parts[0])
      const monthNames: Record<string,number> = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 }
      const month = parts[1] ? (monthNames[parts[1].toLowerCase().slice(0,3)] ?? now.getMonth()) : now.getMonth()
      const blockDate = new Date(now.getFullYear(), month, day).toISOString().split('T')[0]
      await sb.from('blocked_dates').upsert({ blocked_date: blockDate, reason:'Blocked via WhatsApp' })
      reply = `🔴 *${blockDate} Blocked!*\n\nNo new bookings will be accepted.`
    }

    // FREE/UNBLOCK DATE
    else if (text.startsWith('free ')) {
      const parts = text.replace('free ','').trim().split(' ')
      const day = parseInt(parts[0])
      const monthNames: Record<string,number> = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 }
      const month = parts[1] ? (monthNames[parts[1].toLowerCase().slice(0,3)] ?? now.getMonth()) : now.getMonth()
      const freeDate = new Date(now.getFullYear(), month, day).toISOString().split('T')[0]
      await sb.from('blocked_dates').delete().eq('blocked_date', freeDate)
      reply = `🟢 *${freeDate} Unblocked!*\n\nDate is now available for bookings.`
    }

    // CHECK DATE e.g. "25" or "25 july"
    else if (/^\d{1,2}(\s+\w+)?$/.test(text)) {
      const parts = text.split(' ')
      const day = parseInt(parts[0])
      const monthNames: Record<string,number> = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11,january:0,february:1,march:2,april:3,june:5,july:6,august:7,september:8,october:9,november:10,december:11 }
      const month = parts[1] ? (monthNames[parts[1].toLowerCase()] ?? now.getMonth()) : now.getMonth()
      const checkDate = new Date(now.getFullYear(), month, day).toISOString().split('T')[0]

      const { data: bks } = await sb.from('bookings').select('*').eq('booking_date', checkDate).neq('status','cancelled').order('booking_time')
      const { data: blk } = await sb.from('blocked_dates').select('id').eq('blocked_date', checkDate).maybeSingle()
      const bookedTimes = new Set((bks||[]).map((b:any) => b.booking_time))

      if (blk) {
        reply = `🔴 *${checkDate} — BLOCKED*\n\nThis date is blocked. No bookings accepted.\n\nType *free ${day}* to unblock.`
      } else {
        reply = `📅 *${checkDate}*\n\n`
        if (bks?.length) {
          reply += `*Booked:*\n`
          bks.forEach((b:any) => { reply += `❌ ${b.booking_time} — ${b.name}\n` })
          reply += `\n`
        }
        const available = TIME_SLOTS.filter(t => !bookedTimes.has(t))
        if (available.length > 0) {
          reply += `*Available (${available.length} slots):*\n`
          available.slice(0,6).forEach(t => { reply += `✅ ${t}\n` })
          if (available.length > 6) reply += `...+${available.length-6} more slots`
        } else {
          reply += `🔴 All slots booked!`
        }
      }
    }

    // HELP
    else {
      reply = `💄 *Sripuji Makeovers Bot*\n\n*Commands:*\n\n📅 *today* — Today's bookings\n📅 *tomorrow* — Tomorrow's schedule\n📅 *week* — This week overview\n📅 *25* — Check June 25\n📅 *25 july* — Check July 25\n⏳ *pending* — Pending approvals\n✅ *accept 1* — Confirm booking #1\n❌ *reject 1* — Cancel booking #1\n🔴 *block 25* — Block June 25\n🟢 *free 25* — Unblock June 25\n\n_Type any command!_ 💄`
    }

    if (reply) await sendWhatsAppMessage(from, reply)
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json({ status: 'ok' })
  }
}
