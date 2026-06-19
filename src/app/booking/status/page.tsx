'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function BookingStatusPage() {
  const [ref, setRef]       = useState('')
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState<any>(null)
  const [error, setError]   = useState('')

  async function checkStatus() {
    if (!ref.trim()) { setError('Please enter your booking ID'); return }
    setLoading(true)
    setError('')
    setBooking(null)
    try {
      const res  = await fetch(`/api/bookings/status?ref=${ref.trim().toUpperCase()}`)
      const data = await res.json()
      if (!res.ok || !data.booking) { setError('Booking not found. Please check your booking ID.'); return }
      setBooking(data.booking)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statusConfig: Record<string, { icon: string; color: string; bg: string; border: string; label: string; message: string }> = {
    pending:   { icon: '⏳', color: '#92400E', bg: '#FEF3D5', border: '#FDE68A', label: 'Pending Confirmation', message: 'Sri Pujitha will review and confirm your booking soon!' },
    confirmed: { icon: '✅', color: '#15803D', bg: '#F0FDF4', border: '#BBF7D0', label: 'Confirmed!', message: 'Your booking is confirmed! Sri Pujitha will be at your venue on time.' },
    completed: { icon: '🌸', color: '#6B21A8', bg: '#FAF5FF', border: '#E9D5FF', label: 'Completed', message: 'Thank you for choosing Sripuji Makeovers! Hope you loved the look.' },
    cancelled: { icon: '❌', color: '#882020', bg: '#FCEAEA', border: '#F5C1C1', label: 'Cancelled', message: 'This booking has been cancelled. Please book again or contact Sri Pujitha.' },
  }

  const sc = booking ? statusConfig[booking.status] || statusConfig.pending : null

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: '120px 5% 80px', fontFamily: 'var(--font-inter)' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--ink)', marginBottom: '8px' }}>
              Check Booking <span style={{ color: 'var(--coral)' }}>Status</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--muted2)', lineHeight: 1.7 }}>
              Enter your booking ID to check the current status of your appointment.
            </p>
          </div>

          {/* Search box */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
            <label style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '8px' }}>
              Booking ID
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                value={ref}
                onChange={e => setRef(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkStatus()}
                placeholder="e.g. SP-2026-0037"
                style={{ flex: 1, padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: 'var(--bg)', color: 'var(--ink)', transition: 'border-color 0.2s', textTransform: 'uppercase' }}
                onFocus={e => e.target.style.borderColor = 'var(--coral)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <button onClick={checkStatus} disabled={loading}
                style={{ padding: '12px 20px', background: 'var(--coral)', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(240,99,90,0.3)' }}>
                {loading ? '...' : 'Check →'}
              </button>
            </div>
            {error && <p style={{ fontSize: '12px', color: '#B02020', marginTop: '8px', fontWeight: 600 }}>{error}</p>}
          </div>

          {/* Result */}
          {booking && sc && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>

              {/* Status banner */}
              <div style={{ background: sc.bg, border: `1px solid ${sc.border}`, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '36px' }}>{sc.icon}</span>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: sc.color, letterSpacing: '-0.3px' }}>{sc.label}</div>
                  <div style={{ fontSize: '12px', color: sc.color, opacity: 0.8, marginTop: '2px', lineHeight: 1.5 }}>{sc.message}</div>
                </div>
              </div>

              {/* Booking details */}
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: '14px' }}>Booking Details</div>
                {[
                  { icon: '🔖', label: 'Booking ID', value: booking.booking_ref },
                  { icon: '👤', label: 'Name', value: booking.name },
                  { icon: '💄', label: 'Service', value: booking.service },
                  { icon: '📅', label: 'Date', value: booking.booking_date },
                  { icon: '⏰', label: 'Time', value: booking.booking_time + (booking.end_time ? ` – ${booking.end_time}` : '') },
                  { icon: '📍', label: 'Venue', value: booking.venue || '—' },
                  { icon: '📱', label: 'Phone', value: booking.phone },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '14px', width: '20px', flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted2)', width: '80px', flexShrink: 0 }}>{item.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ padding: '16px 24px', background: 'var(--bg)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a href={`https://wa.me/918885397517?text=Hi%20Sri%20Pujitha!%20My%20booking%20ID%20is%20${booking.booking_ref}.%20I%20wanted%20to%20check%20on%20my%20appointment.`}
                  target="_blank" rel="noopener"
                  style={{ flex: 1, padding: '11px', background: '#25D366', color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  💬 WhatsApp Sri Pujitha
                </a>
                <Link href="/booking"
                  style={{ flex: 1, padding: '11px', background: 'var(--coral)', color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  📅 New Booking
                </Link>
              </div>
            </motion.div>
          )}

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link href="/" style={{ fontSize: '12px', color: 'var(--muted2)', textDecoration: 'none' }}>← Back to Home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
