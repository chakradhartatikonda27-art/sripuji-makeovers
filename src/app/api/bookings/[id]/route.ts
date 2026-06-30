import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendWhatsAppMessage, WA_MESSAGES } from '@/lib/whatsapp'
import { syncBookingToCalendar } from '@/lib/googleCalendarHelper'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const updates: Record<string, unknown> = {}
  if (body.status        !== undefined) updates.status        = body.status
  if (body.advance_paid  !== undefined) updates.advance_paid  = body.advance_paid
  if (body.booking_time  !== undefined) updates.booking_time  = body.booking_time
  if (body.venue         !== undefined) updates.venue         = body.venue
  if (body.notes         !== undefined) updates.notes         = body.notes
  if (body.booking_date  !== undefined) updates.booking_date  = body.booking_date
  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabaseAdmin()
    .from('bookings').update(updates).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // WhatsApp notifications
  try {
    if (body.status === 'confirmed' && data.phone) {
      await sendWhatsAppMessage(data.phone, WA_MESSAGES.bookingConfirmed(
        data.name, data.booking_date, data.booking_time, data.service, data.booking_ref
      ))
    } else if (body.status === 'cancelled' && data.phone) {
      await sendWhatsAppMessage(data.phone, WA_MESSAGES.bookingRejected(
        data.name, data.booking_date, data.booking_time
      ))
    }
  } catch (e) {
    console.error('WhatsApp notification failed:', e)
  }

  // Google Calendar sync
  try {
    if (body.status === 'confirmed') {
      const calResult = await syncBookingToCalendar(data, 'create')
    } else if (body.status === 'cancelled') {
      await syncBookingToCalendar(data, 'delete')
    }
  } catch (e) {
    console.error('Google Calendar sync failed:', e)
  }

  return NextResponse.json({ success: true, booking: data })
}
