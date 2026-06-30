import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendWhatsAppMessage, WA_MESSAGES } from '@/lib/whatsapp'
import { syncBookingToCalendar, syncBlockedDateToCalendar } from '@/lib/googleCalendarHelper'

export const dynamic = 'force-dynamic'

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
const ARTIST_PHONE = '918885397517'

const TIME_SLOTS = [
  '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
  '6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM'
]

const MONTH_MAP: Record<string,number> = {
  jan:0, january:0, feb:1, february:1, mar:2, march:2,
  apr:3, april:3, may:4, jun:5, june:5, jul:6, july:6,
  aug:7, august:7, sep:8, september:8, oct:9, october:9,
  nov:10, november:10, dec:11, december:11
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

function isMonthCommand(text: string): boolean {
  const parts = text.split(' ')
  return MONTH_MAP[parts[0]] !== undefined
}

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


    // Only artist can use bot
    if (from !== ARTIST_PHONE) return NextResponse.json({ status: 'ok' })

    // TODAY
    if (text === 'today' || text === 'aaj') {
      const { data: bks } = await sb.from('bookings').select('*')
        .eq('booking_date', today).neq('status', 'cancelled').order('booking_time')
      if (!bks?.length) {
        reply = `📅 *Today — ${today}*\n\n🟢 No bookings today!`
      } else {
        reply = `📅 *Today — ${today}* (${bks.length} booking${bks.length>1?'s':''})\n\n`
        bks.forEach((b,i) => {
          const icon = b.status==='confirmed'?'✅':'⏳'
          reply += `${i+1}. ${icon} ⏰ ${b.booking_time}\n   👤 ${b.name}\n   💄 ${b.service}\n   📱 ${b.phone}\n\n`
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
        reply = `📅 *Tomorrow — ${tDate}*\n\n🟢 No bookings!`
      } else {
        reply = `📅 *Tomorrow — ${tDate}* (${bks.length} booking${bks.length>1?'s':''})\n\n`
        bks.forEach((b,i) => {
          reply += `${i+1}. ✅ ⏰ ${b.booking_time}\n   👤 ${b.name} | 💄 ${b.service}\n   📱 ${b.phone}\n\n`
        })
      }
    }

    // WEEK
    else if (text === 'week') {
      reply = `📅 *This Week Overview*\n\n`
      for (let i=0; i<7; i++) {
        const d = new Date(now); d.setDate(d.getDate()+i)
        const ds  = d.toISOString().split('T')[0]
        const day = d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' })
        const { data: bks } = await sb.from('bookings').select('id').eq('booking_date', ds).neq('status','cancelled')
        const { data: blk } = await sb.from('blocked_dates').select('id').eq('blocked_date', ds).maybeSingle()
        if (blk) reply += `🔴 ${day} — Blocked\n`
        else if (!bks?.length) reply += `🟢 ${day} — Free\n`
        else reply += `🟡 ${day} — ${bks.length} booking${bks.length>1?'s':''}\n`
      }
    }

    // ANY MONTH — jan, feb, march, july 2027, etc.
    else if (text === 'month' || isMonthCommand(text)) {
      const parts    = text === 'month' ? [] : text.split(' ')
      const monthIdx = parts.length > 0 ? (MONTH_MAP[parts[0]] ?? now.getMonth()) : now.getMonth()
      const year     = parts.length > 1 ? parseInt(parts[1]) : now.getFullYear()
      const daysInMonth = new Date(year, monthIdx + 1, 0).getDate()
      const monthStart  = `${year}-${String(monthIdx+1).padStart(2,'0')}-01`
      const monthEnd    = `${year}-${String(monthIdx+1).padStart(2,'0')}-${daysInMonth}`
      const label       = `${MONTH_NAMES[monthIdx]} ${year}`

      const { data: bks } = await sb.from('bookings').select('*')
        .gte('booking_date', monthStart).lte('booking_date', monthEnd)
        .neq('status', 'cancelled').order('booking_date')

      if (!bks?.length) {
        reply = `📅 *${label}*\n\n🟢 No bookings for ${label}!`
      } else {
        const confirmed = bks.filter(b => b.status === 'confirmed')
        const pending   = bks.filter(b => b.status === 'pending')
        const completed = bks.filter(b => b.status === 'completed')
        reply = `📅 *${label} Summary*\n✅ Confirmed: ${confirmed.length}\n⏳ Pending: ${pending.length}\n🌸 Completed: ${completed.length}\n📊 Total: ${bks.length}\n\n`
        bks.forEach((b,i) => {
          const icon = b.status==='confirmed'?'✅':b.status==='pending'?'⏳':'🌸'
          reply += `${i+1}. ${icon} ${b.booking_date} ⏰ ${b.booking_time}\n   👤 ${b.name} | 💄 ${b.service}\n   📱 ${b.phone}\n\n`
        })
      }
    }

    // CONFIRMED
    else if (text === 'confirmed') {
      const { data: bks } = await sb.from('bookings').select('*')
        .eq('status', 'confirmed').order('booking_date')
      if (!bks?.length) {
        reply = `✅ No confirmed bookings!`
      } else {
        reply = `✅ *All Confirmed Bookings (${bks.length})*\n\n`
        bks.forEach((b,i) => {
          reply += `${i+1}. 📅 ${b.booking_date} ⏰ ${b.booking_time}\n   👤 ${b.name} | 💄 ${b.service}\n   📱 ${b.phone}\n\n`
        })
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
        try { await syncBookingToCalendar({...b, status:'confirmed'}, 'create') } catch(e) { console.error('GCal sync:', e) }
        reply = `✅ *Confirmed!*\n\n${b.name}\n📅 ${b.booking_date} ⏰ ${b.booking_time}\n💄 ${b.service}\n📱 ${b.phone}`
        try {
          await sendWhatsAppMessage(b.phone, WA_MESSAGES.bookingConfirmed(b.name, b.booking_date, b.booking_time, b.service, b.booking_ref))
          reply += `\n\n✅ Customer notified!`
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
        try { await syncBookingToCalendar(b, 'delete') } catch(e) { console.error('GCal sync:', e) }
        reply = `❌ *Rejected*\n\n${b.name}\n📅 ${b.booking_date} ⏰ ${b.booking_time}`
        try {
          await sendWhatsAppMessage(b.phone, WA_MESSAGES.bookingRejected(b.name, b.booking_date, b.booking_time))
          reply += `\n\n✅ Customer notified!`
        } catch { reply += `\n\n⚠️ Could not notify customer` }
      } else {
        reply = `❌ Booking #${num+1} not found.`
      }
    }

    // BLOCK DATE
    else if (text.startsWith('block ')) {
      const parts = text.replace('block ','').trim().split(' ')
      const day = parseInt(parts[0])
      const month = parts[1] ? (MONTH_MAP[parts[1].toLowerCase()] ?? now.getMonth()) : now.getMonth()
      const blockDate = new Date(now.getFullYear(), month, day).toISOString().split('T')[0]
      await sb.from('blocked_dates').upsert({ blocked_date: blockDate, reason:'Blocked via WhatsApp' })
      try { await syncBlockedDateToCalendar(blockDate, 'create') } catch(e) { console.error('GCal block sync:', e) }
      reply = `🔴 *${blockDate} Blocked!*\n\nNo new bookings accepted.\nType *free ${day}* to unblock.`
    }

    // FREE/UNBLOCK DATE
    else if (text.startsWith('free ')) {
      const parts = text.replace('free ','').trim().split(' ')
      const day = parseInt(parts[0])
      const month = parts[1] ? (MONTH_MAP[parts[1].toLowerCase()] ?? now.getMonth()) : now.getMonth()
      const freeDate = new Date(now.getFullYear(), month, day).toISOString().split('T')[0]
      await sb.from('blocked_dates').delete().eq('blocked_date', freeDate)
      try { await syncBlockedDateToCalendar(freeDate, 'delete') } catch(e) { console.error('GCal unblock sync:', e) }
      reply = `🟢 *${freeDate} Unblocked!*\n\nDate is now available for bookings.`
    }

    // CHECK DATE e.g. "25" or "25 july"
    else if (/^\d{1,2}(\s+\w+)?$/.test(text)) {
      const parts = text.split(' ')
      const day = parseInt(parts[0])
      const month = parts[1] ? (MONTH_MAP[parts[1].toLowerCase()] ?? now.getMonth()) : now.getMonth()
      const checkDate = new Date(now.getFullYear(), month, day).toISOString().split('T')[0]

      const { data: bks } = await sb.from('bookings').select('*').eq('booking_date', checkDate).neq('status','cancelled').order('booking_time')
      const { data: blk } = await sb.from('blocked_dates').select('id').eq('blocked_date', checkDate).maybeSingle()
      const bookedTimes = new Set((bks||[]).map((b:any) => b.booking_time))

      if (blk) {
        reply = `🔴 *${checkDate} — BLOCKED*\n\nNo bookings accepted.\nType *free ${day}* to unblock.`
      } else {
        reply = `📅 *${checkDate}*\n\n`
        if (bks?.length) {
          reply += `*Booked:*\n`
          bks.forEach((b:any) => { reply += `❌ ${b.booking_time} — ${b.name} (${b.service})\n` })
          reply += `\n`
        }
        const available = TIME_SLOTS.filter(t => !bookedTimes.has(t))
        if (available.length > 0) {
          reply += `*Available (${available.length} slots):*\n`
          available.slice(0,6).forEach(t => { reply += `✅ ${t}\n` })
          if (available.length > 6) reply += `...+${available.length-6} more`
        } else {
          reply += `🔴 All slots booked!`
        }
      }
    }

    // HELP
    else {
      reply = `💄 *Sripuji Makeovers Bot*\n\n*Commands:*\n\n📅 *today* — Today's bookings\n📅 *tomorrow* — Tomorrow\n📅 *week* — This week\n📅 *month* — This month\n📅 *jan / feb / mar...* — Any month\n📅 *july 2027* — Specific month+year\n✅ *confirmed* — All confirmed\n⏳ *pending* — Pending approvals\n📅 *25* — Check date 25\n📅 *25 july* — Check July 25\n✅ *accept 1* — Confirm #1\n❌ *reject 1* — Cancel #1\n🔴 *block 25* — Block June 25\n🔴 *block 25 july* — Block July 25\n🟢 *free 25* — Unblock June 25\n🟢 *free 25 july* — Unblock July 25\n\n_Type any command!_ 💄`
    }

    if (reply) await sendWhatsAppMessage(from, reply)
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json({ status: 'ok' })
  }
}
