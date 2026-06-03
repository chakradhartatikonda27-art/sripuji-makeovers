'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'
import { SITE } from '@/lib/constants'

export default function ContactPage() {
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone) { toast.error('Name and phone are required'); return }
    setSending(true)
    const res  = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const json = await res.json()
    if (res.ok) { toast.success(json.message); setForm({ name: '', phone: '', email: '', service: '', message: '' }) }
    else toast.error(json.error || 'Failed to send')
    setSending(false)
  }

  const inputStyle = { width: '100%', background: '#fff', border: '1.5px solid var(--border)', color: 'var(--ink)', padding: '12px 14px', borderRadius: '8px', fontFamily: 'inherit', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s', appearance: 'none' as const, WebkitAppearance: 'none' as const, marginBottom: '12px' }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>
        <section style={{ background: '#fff', padding: '64px 6% 48px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
            <div className="eyebrow-dash center">Get In Touch</div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)', marginBottom: '14px' }}>
              Let&apos;s <span style={{ color: 'var(--coral)' }}>Connect</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.85, maxWidth: '500px', margin: '0 auto' }}>
              Questions, trial bookings, or want to discuss your bridal look — reach out anytime.
            </p>
          </div>
        </section>

        <section style={{ background: 'var(--blush)', padding: '64px 6%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '64px', maxWidth: '1100px', margin: '0 auto', alignItems: 'start' }}>
            <div>
              {[
                { icon: '📞', label: 'Phone & WhatsApp', value: SITE.phoneDisplay },
                { icon: '✉️', label: 'Email',            value: SITE.email },
                { icon: '📍', label: 'Location',         value: 'Rajahmundry, East Godavari\nAndhra Pradesh, India' },
                { icon: '⏰', label: 'Working Hours',    value: 'Mon–Sat: 8:00 AM – 8:00 PM\nSunday: By Appointment Only' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '14px', marginBottom: '20px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#fff', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)' }}>{item.label}</div>
                    <div style={{ fontSize: '14px', color: 'var(--ink2)', marginTop: '3px', lineHeight: 1.6, fontWeight: 500, whiteSpace: 'pre-line' }}>{item.value}</div>
                  </div>
                </div>
              ))}
              <a href={SITE.whatsapp} target="_blank" rel="noopener"
                style={{ background: '#25D366', color: '#fff', padding: '12px 22px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                Chat on WhatsApp
              </a>
            </div>

            <form onSubmit={submit} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input style={inputStyle} placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                  onFocus={e => (e.target.style.borderColor = 'var(--coral)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                <input style={inputStyle} type="tel" placeholder="Phone Number *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required
                  onFocus={e => (e.target.style.borderColor = 'var(--coral)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <input style={inputStyle} type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={e => (e.target.style.borderColor = 'var(--coral)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              <select style={inputStyle} value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                onFocus={e => (e.target.style.borderColor = 'var(--coral)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
                <option value="">Select a Service</option>
                {['Bridal Makeup','Engagement Makeup','Reception Makeup','Groom Makeup','Hair Styling','Saree Draping','Airbrush Makeup'].map(s => <option key={s}>{s}</option>)}
              </select>
              <textarea style={{ ...inputStyle, minHeight: '110px', resize: 'vertical' }} placeholder="Tell us about your vision, look reference, event details…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                onFocus={e => (e.target.style.borderColor = 'var(--coral)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              <button type="submit" disabled={sending}
                style={{ width: '100%', padding: '13px', background: sending ? 'var(--muted2)' : 'var(--coral)', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: sending ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 18px rgba(240,99,90,0.28)' }}>
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
