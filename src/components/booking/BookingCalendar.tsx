'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabaseBrowser } from '@/lib/supabase'
import type { Service } from '@/types'

const schema = z.object({
  name:         z.string().min(2, 'Please enter your full name'),
  phone:        z.string().min(10, 'Please enter a valid phone number'),
  email:        z.string().email().optional().or(z.literal('')),
  service:      z.string().min(1, 'Please select a service'),
  event_time:   z.string().min(1, 'Please enter your event time'),
  event_date:   z.string().optional(),
  venue:        z.string().optional(),
  notes:        z.string().optional(),
})
type FormData = z.infer<typeof schema>

const MN = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function BookingCalendar() {
  const params  = useSearchParams()
  const [services, setServices] = useState<Service[]>([])
  const [blocked, setBlocked]   = useState<string[]>([])
  const [bookedDates, setBooked] = useState<string[]>([])
  const [calY, setCalY]         = useState(new Date().getFullYear())
  const [calM, setCalM]         = useState(new Date().getMonth())
  const [selDate, setSelDate]   = useState<string | null>(null)
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
    sb.from('bookings').select('booking_date').neq('status', 'cancelled')
      .then(({ data }) => setBooked((data || []).map((d: any) => d.booking_date)))
  }, [])

  const today       = new Date(); today.setHours(0, 0, 0, 0)
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
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          booking_date: selDate,
          booking_time: data.event_time,
          service_price: services.find(s => s.name === data.service)?.price || 0,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setConfirmed({ ref: json.booking.booking_ref, name: data.name, service: data.service, date: selDate, time: data.event_time, phone: data.phone })
      reset(); setSelDate(null)
    } catch (e: any) {
      toast.error(e.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  const inp = { width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--ink)', padding: '11px 14px', borderRadius: '8px', fontFamily: 'var(--font-inter)', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s', appearance: 'none' as const, WebkitAppearance: 'none' as const }
  const lbl = { fontSize: '9px', fontWeight: 700 as const, letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--muted2)', display: 'block' as const, marginBottom: '5px' }

  if (confirmed) return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '44px 36px', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
      <span style={{ fontSize: '52px', display: 'block', marginBottom: '12px' }}>🌸</span>
      <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>
        Booking <span style={{ color: 'var(--coral)' }}>Confirmed!</span>
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--muted2)', marginBottom: '20px' }}>Sri Pujitha will contact you shortly to confirm!</p>
      <div style={{ background: 'var(--blush)', border: '1px solid var(--blush3)', borderRadius: '12px', padding: '16px', fontSize: '13px', color: '#993556', lineHeight: 2.2, textAlign: 'left', fontWeight: 500 }}>
        <strong>{confirmed.name}</strong><br />
        📅 {confirmed.date}<br />
        ⏰ {confirmed.time}<br />
        💄 {confirmed.service}<br />
        📱 {confirmed.phone}<br />
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

      {/* Calendar */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px 28px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', paddingBottom: '16px', borderBottom: '1px solid var(--border)', marginBottom: '22px' }}>
          Step 1 — Choose Your Date
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px', marginBottom: '4px' }}>
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted2)', padding: '6px 0' }}>{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d   = i + 1
            const ds  = `${calY}-${String(calM+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
            const dt  = new Date(calY, calM, d)
            const isPast    = dt < today
            const isBlocked = blocked.includes(ds)
            const isToday   = dt.toDateString() === today.toDateString()
            const isSel     = ds === selDate
            const bkCount   = bookedDates.filter(x => x === ds).length
            const disabled  = isPast || isBlocked

            return (
              <div key={d} onClick={() => !disabled && setSelDate(ds)}
                style={{
                  borderRadius: '8px', cursor: disabled ? 'not-allowed' : 'pointer',
                  padding: '6px 2px', textAlign: 'center', transition: 'all 0.15s',
                  minHeight: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px',
                  background: isSel ? 'var(--coral)' : isBlocked ? '#F3F4F6' : 'transparent',
                  color: disabled ? 'var(--border2)' : isSel ? '#fff' : isToday ? 'var(--coral)' : 'var(--ink)',
                  outline: isToday && !isSel ? '2px solid var(--blush3)' : 'none',
                  transform: isSel ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isSel ? '0 4px 14px rgba(240,99,90,0.3)' : 'none',
                }}
                onMouseEnter={e => { if (!disabled && !isSel) { e.currentTarget.style.background = 'var(--blush)'; e.currentTarget.style.color = 'var(--coral)' }}}
                onMouseLeave={e => { if (!disabled && !isSel) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isToday ? 'var(--coral)' : 'var(--ink)' }}}>
                <span style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1 }}>{d}</span>
                {!disabled && bkCount > 0 && (
                  <span style={{ fontSize: '8px', fontWeight: 700, background: isSel ? 'rgba(255,255,255,0.25)' : 'var(--blush3)', color: isSel ? '#fff' : 'var(--coral)', borderRadius: '50px', padding: '1px 5px' }}>
                    {bkCount} bk
                  </span>
                )}
                {isBlocked && (
                  <span style={{ fontSize: '8px', color: '#9CA3AF', fontWeight: 600 }}>blocked</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {[
            { color: 'var(--coral)', label: 'Selected date' },
            { color: 'var(--blush3)', label: 'Has bookings' },
            { color: '#D1D5DB', label: 'Blocked / Past' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '3px', background: l.color, flexShrink: 0 }} />
              <span style={{ fontSize: '10px', color: 'var(--muted2)' }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Selected date confirmation */}
        {selDate && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '16px', padding: '12px 14px', background: 'var(--blush)', border: '1.5px solid var(--blush3)', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: 'var(--coral)', textAlign: 'center' }}>
            📅 {new Date(selDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </motion.div>
        )}
      </div>

      {/* Form */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px 28px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', paddingBottom: '16px', borderBottom: '1px solid var(--border)', marginBottom: '22px' }}>
          Step 2 — Your Details
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '13px' }}>
            <label style={lbl}>Full Name *</label>
            <input {...register('name')} style={inp} placeholder="Your full name"
              onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            {errors.name && <p style={{ fontSize: '11px', color: '#B02020', marginTop: '4px' }}>{errors.name.message}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '13px' }}>
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

          <div style={{ marginBottom: '13px' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '13px' }}>
            <div>
              <label style={lbl}>Event Time *</label>
              <input {...register('event_time')} style={inp} placeholder="e.g. 8:00 AM or 7 PM"
                onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              {errors.event_time && <p style={{ fontSize: '11px', color: '#B02020', marginTop: '4px' }}>{errors.event_time.message}</p>}
              <p style={{ fontSize: '10px', color: 'var(--muted2)', marginTop: '4px' }}>When do you need the artist?</p>
            </div>
            <div>
              <label style={lbl}>Event Date</label>
              <input {...register('event_date')} type="date" style={inp}
                onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              <p style={{ fontSize: '10px', color: 'var(--muted2)', marginTop: '4px' }}>Actual event date (if different)</p>
            </div>
          </div>

          <div style={{ marginBottom: '13px' }}>
            <label style={lbl}>Venue / Location *</label>
            <input {...register('venue')} style={inp} placeholder="Marriage hall name, address or area"
              onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          <div style={{ marginBottom: '13px' }}>
            <label style={lbl}>Special Requirements</label>
            <input {...register('notes')} style={inp} placeholder="Skin type, look preference, reference photos…"
              onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          {/* Summary */}
          {selDate && (
            <div style={{ background: 'var(--blush)', border: '1px solid var(--blush3)', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px', fontSize: '12px', color: 'var(--coral)', fontWeight: 600, lineHeight: 1.8 }}>
              📅 Date: {selDate}<br />
              ⏰ Time: {watch('event_time') || '—'}<br />
              📍 Venue: {watch('venue') || '—'}
            </div>
          )}

          <button type="submit" disabled={submitting || !selDate}
            style={{ width: '100%', padding: '13px', background: submitting || !selDate ? 'var(--muted2)' : 'var(--coral)', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: submitting || !selDate ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 18px rgba(240,99,90,0.28)' }}>
            {submitting ? 'Confirming…' : !selDate ? 'Select a date first' : 'Confirm Appointment'}
          </button>

          <div style={{ marginTop: '12px', padding: '10px 13px', background: 'var(--blush)', borderLeft: '3px solid var(--blush3)', borderRadius: '0 7px 7px 0', fontSize: '10px', color: 'var(--coral)', lineHeight: 1.65, fontWeight: 600 }}>
            📋 12% advance required · Trial makeup available · Sri Pujitha will confirm via WhatsApp
          </div>
        </form>
      </div>
    </div>
  )
}
