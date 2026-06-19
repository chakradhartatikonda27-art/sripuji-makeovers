'use client'


import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useMobile } from '@/context/MobileContext'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const schema = z.object({
  name:    z.string().min(2, 'Please enter your name'),
  phone:   z.string().min(10, 'Please enter a valid phone'),
  email:   z.string().email().optional().or(z.literal('')),
  service: z.string().optional(),
  message: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function ContactPage() {
  const { isMobile } = useMobile()
  
  const [settings, setSettings] = useState<Record<string, string>>({
    contact_phone:    '+91 88853 97517',
    contact_email:    'sripujimakeovers@gmail.com',
    contact_address:  'Rajahmundry, East Godavari, Andhra Pradesh',
    contact_whatsapp: '918885397517',
  })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetch('/api/site-settings').then(r => r.json())
      .then(d => { if (d && !d.error) setSettings(prev => ({ ...prev, ...d })) })
      .catch(() => {})
  }, [])

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) { toast.success('Message sent! Sri Pujitha will contact you soon.'); reset() }
      else toast.error('Failed to send. Please try WhatsApp.')
    } catch { toast.error('Failed to send') }
    finally { setSending(false) }
  }

  const inp = { width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--ink)', padding: '11px 14px', borderRadius: '8px', fontFamily: 'inherit', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s', appearance: 'none' as const }
  const lbl = { fontSize: '9px', fontWeight: 700 as const, letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--muted2)', display: 'block' as const, marginBottom: '5px' }

  const contacts = [
    { icon: '📞', label: 'Phone', value: settings.contact_phone, href: `tel:${settings.contact_phone}` },
    { icon: '💬', label: 'WhatsApp', value: settings.contact_phone, href: `https://wa.me/${settings.contact_whatsapp}` },
    { icon: '✉️', label: 'Email', value: settings.contact_email, href: `mailto:${settings.contact_email}` },
    { icon: '📍', label: 'Location', value: settings.contact_address, href: undefined },
  ]

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>
        <section style={{ background: '#fff', padding: '64px 6% 32px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="eyebrow-dash">Contact</div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)', lineHeight: 1.1, marginBottom: '10px' }}>
              Let's Create Your <span style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: 'var(--coral)', fontWeight: 600 }}>Perfect Look</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, maxWidth: '480px' }}>
              Reach out to discuss your event. Sri Pujitha travels to your venue across East Godavari and nearby districts.
            </p>
          </div>
        </section>

        <section style={{ padding: '48px 6%', background: 'var(--bg)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr', gap: isMobile ? '20px' : '32px' }}>

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contacts.map(c => (
                <motion.div key={c.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blush3)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(240,99,90,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'var(--blush)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{c.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: '3px' }}>{c.label}</div>
                    {c.href ? (
                      <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener"
                        style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--coral)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink)')}>
                        {c.value}
                      </a>
                    ) : (
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{c.value}</div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* WhatsApp CTA */}
              <a href={`https://wa.me/${settings.contact_whatsapp}?text=Hi%20Sri%20Pujitha!%20I%20would%20like%20to%20book%20a%20makeup%20appointment.`}
                target="_blank" rel="noopener"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', background: '#25D366', borderRadius: '12px', textDecoration: 'none', color: '#fff', fontSize: '14px', fontWeight: 700, marginTop: '4px', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#22c55e')}
                onMouseLeave={e => (e.currentTarget.style.background = '#25D366')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* Contact form */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px' }}>Send a Message</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={lbl}>Your Name *</label>
                    <input {...register('name')} style={inp} placeholder="Full name"
                      onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                    {errors.name && <p style={{ fontSize: '11px', color: '#B02020', marginTop: '4px' }}>{errors.name.message}</p>}
                  </div>
                  <div>
                    <label style={lbl}>Phone *</label>
                    <input {...register('phone')} style={inp} placeholder="+91 98765 43210"
                      onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                    {errors.phone && <p style={{ fontSize: '11px', color: '#B02020', marginTop: '4px' }}>{errors.phone.message}</p>}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={lbl}>Email</label>
                    <input {...register('email')} type="email" style={inp} placeholder="you@email.com"
                      onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                  </div>
                  <div>
                    <label style={lbl}>Service Interested</label>
                    <input {...register('service')} style={inp} placeholder="e.g. Bridal Makeup"
                      onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={lbl}>Message</label>
                  <textarea {...register('message')} rows={4} style={{ ...inp, resize: 'vertical' as const }}
                    placeholder="Tell us about your event, date, venue…"
                    onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                </div>
                <button type="submit" disabled={sending}
                  style={{ width: '100%', padding: '13px', background: sending ? 'var(--muted2)' : 'var(--coral)', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: sending ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 18px rgba(240,99,90,0.25)' }}>
                  {sending ? 'Sending…' : 'Send Message →'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
