'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabaseBrowser } from '@/lib/supabase'
import { TIME_SLOTS } from '@/lib/constants'
import type { Service } from '@/types'

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
  const [services, setServices]   = useState<Service[]>([])
  const [blocked, setBlocked]     = useState<string[]>([])
  const [bookedSlots, setBooked]  = useState<string[]>([])
  const [calY, setCalY]           = useState(new Date().getFullYear())
  const [calM, setCalM]           = useState(new Date().getMonth())
  const [selDate, setSelDate]     = useState<string | null>(null)
  const [selTime, setSelTime]     = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState<{ ref: string; name: string; service: string; date: string; time: string; phone: string } | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
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
    fetch(`/api/bookings/slots?date=${selDate}`)
      .then(r => r.json())
      .then(d => setBooked(d.bookedSlots || []))
  }, [selDate])

  const today = new Date(); today.setHours(0,0,0,0)
  const firstDay    = new Date(calY, calM, 1).getDay()
  const daysInMonth = new Date(calY, calM + 1, 0).getDate()

  function calNav(dir: number) {
    let m = calM + dir, y = calY
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setCalM(m); setCalY(y)
  }

  function pickDate(ds: string) { setSelDate(ds); setSelTime(null) }

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
      toast.error(e.message || 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = { width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--ink)', padding: '11px 14px', borderRadius: '8px', fontFamily: 'var(--font-inter)', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s', appearance: 'none' as const, WebkitAppearance: 'none' as const }
  const labelStyle = { fontSize: '9px', fontWeight: 700 as const, letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--muted2)', display: 'block' as const, marginBottom: '5px' }

  if (confirmed) return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '44px 36px', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
      <span style={{ fontSize: '52px', display: 'block', marginBottom: '12px' }}>🌸</span>
      <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>
        Booking <span style={{ color: 'var(--coral)' }}>Confirmed!</span>
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--muted2)', marginBottom: '20px' }}>Saved to Supabase database successfully.</p>
      <div style={{ background: 'var(--blush)', border: '1px solid var(--blush3)', borderRadius: '12px', padding: '16px', fontSize: '13px', color: '#993556', lineHeight: 2.1, textAlign: 'left', fontWeight: 500 }}>
        <strong>{confirmed.name}</strong><br />
        📅 {confirmed.date} &nbsp;·&nbsp; ⏰ {confirmed.time}<br />
        💄 {confirmed.service}<br />
        📱 WhatsApp confirmation sent to {confirmed.phone}<br />
        🔖 Ref: <strong>{confirmed.ref}</strong>
      </div>
      <button onClick={() => setConfirmed(null)}
        style={{ marginTop: '20px', width: '100%', padding: '13px', background: 'var(--coral)', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
        Make Another Booking
      </button>
    </motion.div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px 28px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', paddingBottom: '16px', borderBottom: '1px solid var(--border)', marginBottom: '22px' }}>
          Step 1 — Choose Date &amp; Time
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{MN[calM]} {calY}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['‹','›'].map((a, i) => (
              <button key={a} onClick={() => calNav(i === 0 ? -1 : 1)}
                style={{ width: 28, height: 28, border: '1.5px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--muted)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '4px' }}>
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted2)', padding: '6px 0' }}>{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d  = i + 1
            const ds = `${calY}-${String(calM+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
            const dt = new Date(calY, calM, d)
            const isPast    = dt < today
            const isBlocked = blocked.includes(ds)
            const isToday   = dt.toDateString() === today.toDateString()
            const isSel     = ds === selDate
            const disabled  = isPast || isBlocked

            return (
              <div key={d} onClick={() => !disabled && pickDate(ds)}
                style={{
                  aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 500, borderRadius: '6px', cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s', position: 'relative',
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

        <AnimatePresence>
          {selDate && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: '8px' }}>
                Available Time Slots — {selDate}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' }}>
                {TIME_SLOTS.map(slot => {
                  const taken = bookedSlots.includes(slot)
                  const sel   = slot === selTime
                  return (
                    <button key={slot} disabled={taken} onClick={() => setSelTime(slot)}
                      style={{ padding: '9px 4px', textAlign: 'center', fontSize: '10px', fontWeight: 600, border: `1.5px solid ${sel ? 'var(--coral)' : 'var(--border)'}`, borderRadius: '6px', background: sel ? 'var(--coral)' : 'transparent', color: taken ? 'var(--border2)' : sel ? '#fff' : 'var(--muted)', cursor: taken ? 'not-allowed' : 'pointer', textDecoration: taken ? 'line-through' : 'none', transition: 'all 0.15s' }}>
                      {taken ? slot + ' ✗' : slot}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px 28px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', paddingBottom: '16px', borderBottom: '1px solid var(--border)', marginBottom: '22px' }}>
          Step 2 — Enter Your Details
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '13px' }}>
            <label style={labelStyle}>Full Name *</label>
            <input {...register('name')} style={inputStyle} placeholder="Your full name"
              onFocus={e => (e.target.style.borderColor = 'var(--coral-l, #F5857E)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            {errors.name && <p style={{ fontSize: '11px', color: '#B02020', marginTop: '4px' }}>{errors.name.message}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '13px' }}>
            <div>
              <label style={labelStyle}>Phone *</label>
              <input {...register('phone')} style={inputStyle} placeholder="+91 88853 97517"
                onFocus={e => (e.target.style.borderColor = 'var(--coral-l, #F5857E)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              {errors.phone && <p style={{ fontSize: '11px', color: '#B02020', marginTop: '4px' }}>{errors.phone.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input {...register('email')} type="email" style={inputStyle} placeholder="you@email.com"
                onFocus={e => (e.target.style.borderColor = 'var(--coral-l, #F5857E)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          </div>

          <div style={{ marginBottom: '13px' }}>
            <label style={labelStyle}>Service *</label>
            <select {...register('service')} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--coral-l, #F5857E)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
              <option value="">Select a service</option>
              {services.map(s => (
                <option key={s.id} value={s.name}>{s.name} — ₹{s.price.toLocaleString('en-IN')}</option>
              ))}
            </select>
            {errors.service && <p style={{ fontSize: '11px', color: '#B02020', marginTop: '4px' }}>{errors.service.message}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '13px' }}>
            <div>
              <label style={labelStyle}>Event Date</label>
              <input {...register('event_date')} type="date" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--coral-l, #F5857E)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label style={labelStyle}>Venue</label>
              <input {...register('venue')} style={inputStyle} placeholder="Hall / address"
                onFocus={e => (e.target.style.borderColor = 'var(--coral-l, #F5857E)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          </div>

          <div style={{ marginBottom: '13px' }}>
            <label style={labelStyle}>Special Requirements</label>
            <input {...register('notes')} style={inputStyle} placeholder="Skin type, look preference, reference…"
              onFocus={e => (e.target.style.borderColor = 'var(--coral-l, #F5857E)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          <button type="submit" disabled={submitting}
            style={{ width: '100%', padding: '13px', background: submitting ? 'var(--muted2)' : 'var(--coral)', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 18px rgba(240,99,90,0.28)' }}>
            {submitting ? 'Confirming…' : 'Confirm Appointment'}
          </button>
          <div style={{ marginTop: '12px', padding: '10px 13px', background: 'var(--blush)', borderLeft: '3px solid var(--blush3)', borderRadius: '0 7px 7px 0', fontSize: '10px', color: 'var(--coral)', lineHeight: 1.65, fontWeight: 600 }}>
            📋 12% advance required · Trial makeup available · No refund on advance
          </div>
        </form>
      </div>
    </div>
  )
}
