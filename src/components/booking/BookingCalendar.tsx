'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabaseBrowser } from '@/lib/supabase'
import { useMobile } from '@/context/MobileContext'
import type { Service } from '@/types'

const TIME_SLOTS = [
  { label: '🌅 6:00 AM', value: '6:00 AM' },
  { label: '🌅 7:00 AM', value: '7:00 AM' },
  { label: '🌅 8:00 AM', value: '8:00 AM' },
  { label: '🌅 9:00 AM', value: '9:00 AM' },
  { label: '🌅 10:00 AM', value: '10:00 AM' },
  { label: '☀️ 11:00 AM', value: '11:00 AM' },
  { label: '☀️ 12:00 PM', value: '12:00 PM' },
  { label: '☀️ 1:00 PM', value: '1:00 PM' },
  { label: '☀️ 2:00 PM', value: '2:00 PM' },
  { label: '☀️ 3:00 PM', value: '3:00 PM' },
  { label: '🌆 4:00 PM', value: '4:00 PM' },
  { label: '🌆 5:00 PM', value: '5:00 PM' },
  { label: '🌆 6:00 PM', value: '6:00 PM' },
  { label: '🌙 7:00 PM', value: '7:00 PM' },
  { label: '🌙 8:00 PM', value: '8:00 PM' },
  { label: '🌙 9:00 PM', value: '9:00 PM' },
  { label: '🌙 10:00 PM', value: '10:00 PM' },
]

const schema = z.object({
  name:       z.string().min(2, 'Please enter your full name'),
  phone:      z.string().min(10, 'Please enter a valid phone number'),
  email:      z.string().email().optional().or(z.literal('')),
  service:    z.string().min(1, 'Please select a service'),
  event_date: z.string().optional(),
  venue:      z.string().optional(),
  notes:      z.string().optional(),
})
type FormData = z.infer<typeof schema>

const MN = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function BookingCalendar() {
  const params = useSearchParams()
  const { isMobile } = useMobile()
  const [services, setServices]     = useState<Service[]>([])
  const [blocked, setBlocked]       = useState<string[]>([])
  const [bookedTimes, setBookedTimes] = useState<string[]>([])
  const [calY, setCalY]             = useState(new Date().getFullYear())
  const [calM, setCalM]             = useState(new Date().getMonth())
  const [selDate, setSelDate]       = useState<string | null>(null)
  const [selTime, setSelTime]       = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed]   = useState<any>(null)

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { service: params.get('service') || '' },
  })

  useEffect(() => {
    const sb = supabaseBrowser()
    sb.from('services').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => setServices(data || []))
    sb.from('blocked_dates').select('blocked_date')
      .then(({ data }) => setBlocked((data || []).map((d: any) => d.blocked_date)))
  }, [])

  useEffect(() => {
    if (!selDate) return
    setSelTime(null)
    fetch(`/api/bookings/slots?date=${selDate}`)
      .then(r => r.json())
      .then(d => setBookedTimes(d.bookedSlots || []))
  }, [selDate])

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const firstDay    = new Date(calY, calM, 1).getDay()
  const daysInMonth = new Date(calY, calM + 1, 0).getDate()

  function calNav(dir: number) {
    let m = calM + dir, y = calY
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setCalM(m); setCalY(y)
  }

  async function onSubmit(data: FormData) {
    if (!selDate) { toast.error('Please select a date'); return }
    if (!selTime) { toast.error('Please select a time slot'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          booking_date: selDate,
          booking_time: selTime,
          service_price: services.find(s => s.name === data.service)?.price || 0,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setConfirmed({ ref: json.booking.booking_ref, name: data.name, service: data.service, date: selDate, time: selTime, phone: data.phone })
      reset(); setSelDate(null); setSelTime(null)
    } catch (e: any) {
      toast.error(e.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  const inp = { width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--ink)', padding: '11px 14px', borderRadius: '8px', fontFamily: 'var(--font-inter)', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s', appearance: 'none' as const }
  const lbl = { fontSize: '9px', fontWeight: 700 as const, letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--muted2)', display: 'block' as const, marginBottom: '5px' }

  if (confirmed) return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '44px 36px', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
      <span style={{ fontSize: '52px', display: 'block', marginBottom: '12px' }}>🌸</span>
      <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>
        Request <span style={{ color: 'var(--coral)' }}>Submitted!</span>
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--muted2)', marginBottom: '20px' }}>Your booking request has been received. Please wait for Sri Pujitha to confirm!</p>
      <div style={{ background: 'var(--blush)', border: '1px solid var(--blush3)', borderRadius: '12px', padding: '16px', fontSize: '13px', color: '#993556', lineHeight: 2.2, textAlign: 'left', fontWeight: 500 }}>
        <strong>{confirmed.name}</strong><br />
        📅 Date: {confirmed.date}<br />
        ⏰ Time: {confirmed.time}<br />
        💄 Service: {confirmed.service}<br />
        📱 Phone: {confirmed.phone}<br />
        🔖 Booking ID: <strong>{confirmed.ref}</strong><br />
        🟡 Status: <strong style={{color:'#92400E'}}>PENDING CONFIRMATION</strong>
      </div>
      <div style={{ marginTop: '16px', padding: '12px 14px', background: '#FEF3D5', border: '1px solid #FDE68A', borderRadius: '8px', fontSize: '12px', color: '#92400E', fontWeight: 600, lineHeight: 1.7 }}>
        ⏳ <strong>Status: Pending Confirmation</strong><br/>
        Sri Pujitha will review your request and confirm via WhatsApp within 2 hours.<br/>
        Keep your phone handy — you'll receive a WhatsApp message once confirmed!
      </div>
      <a href={`https://wa.me/918885397517?text=Hi%20Sri%20Pujitha!%20I%20just%20booked%20an%20appointment%20(Ref:%20${confirmed.ref}).%20Please%20confirm%20my%20booking!`}
        target="_blank" rel="noopener"
        style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#25D366', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
        💬 Message Sri Pujitha on WhatsApp
      </a>
      <button onClick={() => setConfirmed(null)}
        style={{ marginTop: '16px', width: '100%', padding: '13px', background: 'var(--coral)', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
        Make Another Booking
      </button>
    </motion.div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.1fr', gap: isMobile ? '16px' : '24px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Calendar + Time Picker */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', paddingBottom: '14px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
          Step 1 — Choose Date & Time
        </div>

        {/* Month nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{MN[calM]} {calY}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['‹','›'].map((a, i) => (
              <button key={a} onClick={() => calNav(i === 0 ? -1 : 1)}
                style={{ width: 28, height: 28, border: '1.5px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--muted)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '4px' }}>
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted2)', padding: '5px 0' }}>{d}</div>
          ))}
        </div>

        {/* Days */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '16px' }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d   = i + 1
            const ds  = `${calY}-${String(calM+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
            const dt  = new Date(calY, calM, d)
            const isPast    = dt < today
            const isBlocked = blocked.includes(ds)
            const isToday   = dt.toDateString() === today.toDateString()
            const isSel     = ds === selDate
            const disabled  = isPast || isBlocked
            return (
              <div key={d} onClick={() => !disabled && setSelDate(ds)}
                style={{
                  aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 600, borderRadius: '6px', cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  background: isSel ? 'var(--coral)' : 'transparent',
                  color: disabled ? 'var(--border2)' : isSel ? '#fff' : isToday ? 'var(--coral)' : 'var(--muted)',
                  outline: isToday && !isSel ? '2px solid var(--blush3)' : 'none',
                  textDecoration: isBlocked ? 'line-through' : 'none',
                }}
                onMouseEnter={e => { if (!disabled && !isSel) { e.currentTarget.style.background = 'var(--blush)'; e.currentTarget.style.color = 'var(--coral)' }}}
                onMouseLeave={e => { if (!disabled && !isSel) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isToday ? 'var(--coral)' : 'var(--muted)' }}}>
                {d}
              </div>
            )
          })}
        </div>

        {/* Selected date */}
        {selDate && (
          <div style={{ padding: '10px 12px', background: 'var(--blush)', border: '1px solid var(--blush3)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: 'var(--coral)', marginBottom: '16px' }}>
            📅 {new Date(selDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        )}

        {/* Time picker */}
        {selDate && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: '10px' }}>
              Step 2 — Select Time
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' }}>
              {TIME_SLOTS.map(slot => {
                const taken = bookedTimes.includes(slot.value)
                const sel   = slot.value === selTime
                return (
                  <button key={slot.value} disabled={taken} onClick={() => setSelTime(slot.value)}
                    style={{
                      padding: '8px 4px', borderRadius: '7px', cursor: taken ? 'not-allowed' : 'pointer',
                      border: `1.5px solid ${sel ? 'var(--coral)' : taken ? 'var(--border)' : 'var(--blush3)'}`,
                      background: sel ? 'var(--coral)' : taken ? '#F9FAFB' : 'var(--blush)',
                      color: sel ? '#fff' : taken ? 'var(--muted2)' : 'var(--ink)',
                      fontSize: '11px', fontWeight: 600, fontFamily: 'inherit',
                      transition: 'all 0.15s', textAlign: 'center',
                      textDecoration: taken ? 'line-through' : 'none',
                      opacity: taken ? 0.5 : 1,
                    }}>
                    {slot.label}
                    {taken && <div style={{ fontSize: '8px', color: '#882020', fontWeight: 700 }}>Booked</div>}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Form */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', paddingBottom: '14px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
          Step 3 — Your Details
        </div>

        {/* Summary */}
        {selDate && selTime && (
          <div style={{ background: 'var(--blush)', border: '1.5px solid var(--blush3)', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', fontSize: '12px', color: 'var(--coral)', fontWeight: 600 }}>
            📅 {selDate} &nbsp;·&nbsp; ⏰ {selTime}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '12px' }}>
            <label style={lbl}>Full Name *</label>
            <input {...register('name')} style={inp} placeholder="Your full name"
              onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            {errors.name && <p style={{ fontSize: '11px', color: '#B02020', marginTop: '4px' }}>{errors.name.message}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={lbl}>Phone *</label>
              <input {...register('phone')} style={inp} placeholder="+91 98765 43210"
                onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              {errors.phone && <p style={{ fontSize: '11px', color: '#B02020', marginTop: '4px' }}>{errors.phone.message}</p>}
            </div>
            <div>
              <label style={lbl}>Email</label>
              <input {...register('email')} type="email" style={inp} placeholder="you@email.com"
                onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={lbl}>Service *</label>
            <select {...register('service')} style={inp}
              onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
              <option value="">Select a service</option>
              {services.map(s => (
                <option key={s.id} value={s.name}>{s.name} — ₹{s.price.toLocaleString('en-IN')}</option>
              ))}
            </select>
            {errors.service && <p style={{ fontSize: '11px', color: '#B02020', marginTop: '4px' }}>{errors.service.message}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={lbl}>Event Date</label>
              <input {...register('event_date')} type="date" style={inp}
                onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label style={lbl}>Venue / Location</label>
              <input {...register('venue')} style={inp} placeholder="Hall name or address"
                onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={lbl}>Special Requirements</label>
            <input {...register('notes')} style={inp} placeholder="Skin type, look preference, reference…"
              onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          <button type="submit" disabled={submitting || !selDate || !selTime}
            style={{ width: '100%', padding: '13px', background: submitting || !selDate || !selTime ? 'var(--muted2)' : 'var(--coral)', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: submitting || !selDate || !selTime ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 18px rgba(240,99,90,0.28)' }}>
            {submitting ? 'Submitting…' : !selDate ? 'Select a date first' : !selTime ? 'Select a time slot' : 'Request Appointment →'}
          </button>

          <div style={{ marginTop: '10px', padding: '10px 12px', background: 'var(--blush)', borderLeft: '3px solid var(--blush3)', borderRadius: '0 7px 7px 0', fontSize: '10px', color: 'var(--coral)', lineHeight: 1.65, fontWeight: 600 }}>
            📋 Sri Pujitha will confirm via WhatsApp within 2 hours
          </div>
        </form>
      </div>
    </div>
  )
}
