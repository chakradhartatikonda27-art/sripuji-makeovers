import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BookingCalendar from '@/components/booking/BookingCalendar'


export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>
        <section style={{ background: '#fff', padding: '64px 6% 48px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="eyebrow-dash">Book an Appointment</div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)', marginBottom: '14px' }}>
              Reserve Your <span style={{ color: 'var(--coral)' }}>Date</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.85, maxWidth: '540px' }}>
              Select your preferred date and time. Instant confirmation with WhatsApp notification.
            </p>
          </div>
        </section>
        <section style={{ background: 'var(--bg)', padding: '64px 6%' }}>
          <Suspense fallback={<div style={{ textAlign: 'center', color: 'var(--muted2)', padding: '40px' }}>Loading booking system…</div>}>
            <BookingCalendar />
          </Suspense>
        </section>
        <section style={{ background: '#fff', padding: '32px 6%', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
            Prefer to book directly? Call or WhatsApp&nbsp;
            <a href="https://wa.me/918885397517" style={{ color: 'var(--coral)', fontWeight: 600, textDecoration: 'none' }}>
              +91 88853 97517
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
