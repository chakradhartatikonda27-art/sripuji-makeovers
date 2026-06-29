'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useMobile } from '@/context/MobileContext'

export default function MyBookingPage() {
  const { isMobile } = useMobile()
  const [step, setStep]       = useState<'login'|'dashboard'>('login')
  const [ref, setRef]         = useState('')
  const [phone, setPhone]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [booking, setBooking] = useState<any>(null)
  const [action, setAction]   = useState<'reschedule'|'cancel'|null>(null)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [saving, setSaving]   = useState(false)
  const [success, setSuccess] = useState('')

  const TIME_SLOTS = [
    '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
    '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
    '6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM'
  ]

  const statusConfig: Record<string, any> = {
    pending:   { icon:'⏳', color:'#92400E', bg:'#FEF3D5', border:'#FDE68A', label:'Pending Confirmation' },
    confirmed: { icon:'✅', color:'#15803D', bg:'#F0FDF4', border:'#BBF7D0', label:'Confirmed' },
    completed: { icon:'🌸', color:'#6B21A8', bg:'#FAF5FF', border:'#E9D5FF', label:'Completed' },
    cancelled: { icon:'❌', color:'#882020', bg:'#FCEAEA', border:'#F5C1C1', label:'Cancelled' },
  }

  async function login() {
    if (!ref.trim() || !phone.trim()) { setError('Enter booking ID and phone number'); return }
    setLoading(true); setError('')
    try {
      const res  = await fetch(`/api/bookings/status?ref=${ref.trim().toUpperCase()}`)
      const data = await res.json()
      if (!res.ok || !data.booking) { setError('Booking not found. Check your booking ID.'); return }
      // Verify phone matches
      const bkPhone = data.booking.phone.replace(/[^0-9]/g, '')
      const inputPhone = phone.replace(/[^0-9]/g, '')
      if (!bkPhone.endsWith(inputPhone.slice(-10))) {
        setError('Phone number does not match booking. Please check.')
        return
      }
      setBooking(data.booking)
      setStep('dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function cancelBooking() {
    setSaving(true)
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      })
      if (res.ok) {
        setBooking({ ...booking, status: 'cancelled' })
        setAction(null)
        setSuccess('Booking cancelled successfully.')
      }
    } catch { setError('Failed to cancel. Please contact us.') }
    finally { setSaving(false) }
  }

  async function rescheduleBooking() {
    if (!newDate || !newTime) { setError('Select new date and time'); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_date: newDate, booking_time: newTime, status: 'pending' }),
      })
      if (res.ok) {
        setBooking({ ...booking, booking_date: newDate, booking_time: newTime, status: 'pending' })
        setAction(null)
        setSuccess('Reschedule request sent! Sri Pujitha will confirm shortly.')
      }
    } catch { setError('Failed to reschedule. Please contact us.') }
    finally { setSaving(false) }
  }

  const sc = booking ? statusConfig[booking.status] || statusConfig.pending : null
  const canModify = false // Disabled — contact artist to modify
  const inp = { width:'100%', padding:'12px 14px', border:'1.5px solid var(--border)', borderRadius:'8px', fontSize:'14px', fontFamily:'inherit', outline:'none', background:'var(--bg)', color:'var(--ink)', transition:'border-color 0.2s' } as any

  return (
    <>
      <Navbar />
      <main style={{ minHeight:'100vh', background:'var(--bg)', padding: isMobile ? '100px 5% 60px' : '120px 6% 80px', fontFamily:'var(--font-inter)' }}>
        <div style={{ maxWidth:'560px', margin:'0 auto' }}>

          {step === 'login' && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
              <div style={{ textAlign:'center', marginBottom:'32px' }}>
                <div style={{ fontSize:'48px', marginBottom:'12px' }}>📅</div>
                <h1 style={{ fontSize:'28px', fontWeight:800, letterSpacing:'-0.5px', color:'var(--ink)', marginBottom:'8px' }}>
                  My <span style={{ color:'var(--coral)' }}>Booking</span>
                </h1>
                <p style={{ fontSize:'14px', color:'var(--muted2)', lineHeight:1.7 }}>
                  Enter your booking ID and phone number to manage your appointment.
                </p>
              </div>

              <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'16px', padding:'28px' }}>
                <div style={{ marginBottom:'16px' }}>
                  <label style={{ fontSize:'9px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as const, color:'var(--muted2)', display:'block', marginBottom:'6px' }}>
                    Booking ID
                  </label>
                  <input value={ref} onChange={e=>setRef(e.target.value.toUpperCase())}
                    placeholder="SP-2026-0001" style={inp}
                    onFocus={e=>e.target.style.borderColor='var(--coral)'}
                    onBlur={e=>e.target.style.borderColor='var(--border)'}
                    onKeyDown={e=>e.key==='Enter'&&login()} />
                </div>
                <div style={{ marginBottom:'20px' }}>
                  <label style={{ fontSize:'9px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as const, color:'var(--muted2)', display:'block', marginBottom:'6px' }}>
                    Phone Number
                  </label>
                  <input value={phone} onChange={e=>setPhone(e.target.value)}
                    placeholder="+91 98765 43210" style={inp} type="tel"
                    onFocus={e=>e.target.style.borderColor='var(--coral)'}
                    onBlur={e=>e.target.style.borderColor='var(--border)'}
                    onKeyDown={e=>e.key==='Enter'&&login()} />
                </div>
                {error && <p style={{ fontSize:'12px', color:'#B02020', marginBottom:'12px', fontWeight:600 }}>{error}</p>}
                <button onClick={login} disabled={loading}
                  style={{ width:'100%', padding:'13px', background:loading?'var(--muted2)':'var(--coral)', color:'#fff', borderRadius:'8px', fontSize:'13px', fontWeight:700, border:'none', cursor:loading?'not-allowed':'pointer', boxShadow:'0 4px 18px rgba(240,99,90,0.28)' }}>
                  {loading ? 'Finding booking...' : 'View My Booking →'}
                </button>
              </div>

              <div style={{ textAlign:'center', marginTop:'20px' }}>
                <Link href="/booking" style={{ fontSize:'12px', color:'var(--coral)', textDecoration:'none', fontWeight:600 }}>
                  📅 Make a new booking
                </Link>
                <span style={{ margin:'0 12px', color:'var(--border)' }}>|</span>
                <a href="https://wa.me/918885397517" target="_blank" rel="noopener"
                  style={{ fontSize:'12px', color:'#25D366', textDecoration:'none', fontWeight:600 }}>
                  💬 Contact on WhatsApp
                </a>
              </div>
            </motion.div>
          )}

          {step === 'dashboard' && booking && sc && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>

              {/* Status banner */}
              <div style={{ background:sc.bg, border:`1.5px solid ${sc.border}`, borderRadius:'16px', padding:'20px 24px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'16px' }}>
                <span style={{ fontSize:'40px' }}>{sc.icon}</span>
                <div>
                  <div style={{ fontSize:'18px', fontWeight:800, color:sc.color }}>{sc.label}</div>
                  <div style={{ fontSize:'12px', color:sc.color, opacity:0.8, marginTop:'2px' }}>
                    {booking.status==='pending' && 'Sri Pujitha will confirm within 2 hours'}
                    {booking.status==='confirmed' && 'Your appointment is confirmed! 🎉'}
                    {booking.status==='completed' && 'Thank you for choosing Sripuji Makeovers!'}
                    {booking.status==='cancelled' && 'This booking has been cancelled'}
                  </div>
                </div>
              </div>

              {success && (
                <div style={{ background:'#F0FDF4', border:'1.5px solid #BBF7D0', borderRadius:'10px', padding:'12px 16px', marginBottom:'16px', fontSize:'13px', color:'#15803D', fontWeight:600 }}>
                  ✅ {success}
                </div>
              )}

              {/* Booking details */}
              <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden', marginBottom:'16px' }}>
                <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', background:'var(--bg)' }}>
                  <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as const, color:'var(--muted2)' }}>Booking Details</div>
                </div>
                <div style={{ padding:'4px 0' }}>
                  {[
                    { icon:'🔖', label:'Booking ID',  value:booking.booking_ref },
                    { icon:'👤', label:'Name',         value:booking.name },
                    { icon:'💄', label:'Service',      value:booking.service },
                    { icon:'📅', label:'Date',         value:booking.booking_date },
                    { icon:'⏰', label:'Time',         value:booking.booking_time + (booking.end_time ? ` – ${booking.end_time}` : '') },
                    { icon:'📍', label:'Venue',        value:booking.venue || '—' },
                    { icon:'📱', label:'Phone',        value:booking.phone },
                    { icon:'💰', label:'Service Price', value:`₹${booking.service_price?.toLocaleString('en-IN') || '—'}` },
                  ].map(item => (
                    <div key={item.label} style={{ display:'flex', gap:'12px', padding:'12px 20px', borderBottom:'1px solid var(--border)' }}>
                      <span style={{ fontSize:'16px', width:'22px', flexShrink:0 }}>{item.icon}</span>
                      <span style={{ fontSize:'11px', fontWeight:600, color:'var(--muted2)', width:'90px', flexShrink:0 }}>{item.label}</span>
                      <span style={{ fontSize:'13px', fontWeight:600, color:'var(--ink)' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reschedule form */}
              {action === 'reschedule' && (
                <div style={{ background:'#FFF5F4', border:'1.5px solid var(--blush3)', borderRadius:'12px', padding:'20px', marginBottom:'16px' }}>
                  <div style={{ fontSize:'13px', fontWeight:700, color:'var(--coral)', marginBottom:'14px' }}>📅 Reschedule Appointment</div>
                  <div style={{ marginBottom:'12px' }}>
                    <label style={{ fontSize:'9px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as const, color:'var(--muted2)', display:'block', marginBottom:'6px' }}>New Date</label>
                    <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)}
                      style={inp} min={new Date().toISOString().split('T')[0]}
                      onFocus={e=>e.target.style.borderColor='var(--coral)'}
                      onBlur={e=>e.target.style.borderColor='var(--border)'} />
                  </div>
                  <div style={{ marginBottom:'14px' }}>
                    <label style={{ fontSize:'9px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as const, color:'var(--muted2)', display:'block', marginBottom:'6px' }}>New Time</label>
                    <select value={newTime} onChange={e=>setNewTime(e.target.value)} style={{ ...inp, appearance:'none' as const }}>
                      <option value="">Select time</option>
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  {error && <p style={{ fontSize:'12px', color:'#B02020', marginBottom:'10px' }}>{error}</p>}
                  <div style={{ display:'flex', gap:'10px' }}>
                    <button onClick={rescheduleBooking} disabled={saving}
                      style={{ flex:1, padding:'11px', background:'var(--coral)', color:'#fff', borderRadius:'8px', fontSize:'12px', fontWeight:700, border:'none', cursor:'pointer' }}>
                      {saving ? 'Saving...' : '✓ Confirm Reschedule'}
                    </button>
                    <button onClick={()=>{setAction(null);setError('')}}
                      style={{ padding:'11px 16px', background:'#fff', color:'var(--muted)', borderRadius:'8px', fontSize:'12px', fontWeight:600, border:'1.5px solid var(--border)', cursor:'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Cancel confirm */}
              {action === 'cancel' && (
                <div style={{ background:'#FCEAEA', border:'1.5px solid #F5C1C1', borderRadius:'12px', padding:'20px', marginBottom:'16px' }}>
                  <div style={{ fontSize:'13px', fontWeight:700, color:'#882020', marginBottom:'8px' }}>❌ Cancel Booking</div>
                  <p style={{ fontSize:'12px', color:'#882020', marginBottom:'14px', lineHeight:1.6 }}>
                    Are you sure you want to cancel your appointment for {booking.booking_date} at {booking.booking_time}?
                  </p>
                  <div style={{ display:'flex', gap:'10px' }}>
                    <button onClick={cancelBooking} disabled={saving}
                      style={{ flex:1, padding:'11px', background:'#882020', color:'#fff', borderRadius:'8px', fontSize:'12px', fontWeight:700, border:'none', cursor:'pointer' }}>
                      {saving ? 'Cancelling...' : 'Yes, Cancel Booking'}
                    </button>
                    <button onClick={()=>setAction(null)}
                      style={{ padding:'11px 16px', background:'#fff', color:'var(--muted)', borderRadius:'8px', fontSize:'12px', fontWeight:600, border:'1.5px solid var(--border)', cursor:'pointer' }}>
                      Keep Booking
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              {canModify && !action && (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'16px' }}>
                  <button onClick={()=>setAction('reschedule')}
                    style={{ padding:'12px', background:'#fff', color:'var(--coral)', borderRadius:'10px', fontSize:'12px', fontWeight:700, border:'2px solid var(--coral)', cursor:'pointer' }}>
                    📅 Reschedule
                  </button>
                  <button onClick={()=>setAction('cancel')}
                    style={{ padding:'12px', background:'#fff', color:'#882020', borderRadius:'10px', fontSize:'12px', fontWeight:700, border:'2px solid #F5C1C1', cursor:'pointer' }}>
                    ❌ Cancel
                  </button>
                </div>
              )}

              {/* Contact & Back */}
              <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
                <a href={`https://wa.me/918885397517?text=Hi! My booking ref is ${booking.booking_ref}`}
                  target="_blank" rel="noopener"
                  style={{ flex:1, padding:'12px', background:'#25D366', color:'#fff', borderRadius:'10px', fontSize:'12px', fontWeight:700, textDecoration:'none', textAlign:'center' as const, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
                  💬 WhatsApp Sri Pujitha
                </a>
              </div>

              <button onClick={()=>{setStep('login');setBooking(null);setRef('');setPhone('');setSuccess('');setAction(null)}}
                style={{ width:'100%', padding:'11px', background:'transparent', color:'var(--muted2)', borderRadius:'8px', fontSize:'12px', fontWeight:600, border:'1.5px solid var(--border)', cursor:'pointer' }}>
                ← Back to Search
              </button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
