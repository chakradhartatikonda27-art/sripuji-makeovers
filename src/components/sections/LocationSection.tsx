'use client'

import { useEffect, useState } from 'react'
import { useMobile } from '@/context/MobileContext'

export default function LocationSection() {
  const { isMobile } = useMobile()
  const [s, setS] = useState({
    contact_phone:    '+91 88853 97517',
    contact_email:    'sripujimakeovers@gmail.com',
    contact_address:  'Rajahmundry, East Godavari, Andhra Pradesh',
    contact_whatsapp: '918885397517',
  })

  useEffect(() => {
    fetch('/api/site-settings').then(r => r.json())
      .then(d => { if (d && !d.error) setS(prev => ({ ...prev, ...d })) })
      .catch(() => {})
  }, [])

  const areas = ['Rajahmundry','Kakinada','Amalapuram','Bhimavaram','Tanuku','Narsapur','Eluru','Vijayawada']

  return (
    <section id="location" style={{ background: '#fff', padding: isMobile ? '52px 5%' : '80px 6%', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="eyebrow-dash" style={{ justifyContent: 'center' }}>Location</div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)', lineHeight: 1.1, marginBottom: '12px' }}>
            We Travel to <span style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: 'var(--coral)', fontWeight: 600 }}>Your Venue</span>
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto' }}>
            Based in Rajahmundry, Sri Pujitha travels across East Godavari and nearby districts for all events.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Google Map */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61263.85854979897!2d81.7363!3d17.0005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37a428cb7d21c5%3A0x8c0a27b5d9b79dd9!2sRajahmundry%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1686000000000!5m2!1sen!2sin"
              width="100%"
              height={isMobile ? '280' : '400'}
              style={{ border: 'none', display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sripuji Makeovers — Rajahmundry"
            />
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'var(--blush)', border: '1px solid var(--blush3)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: '10px' }}>📍 Based In</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>Rajahmundry</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>{s.contact_address}</div>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: '12px' }}>✈️ Service Areas</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {areas.map(area => (
                  <span key={area} style={{ padding: '5px 12px', background: 'var(--blush)', border: '1px solid var(--blush3)', borderRadius: '50px', fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>{area}</span>
                ))}
                <span style={{ padding: '5px 12px', background: 'var(--blush)', border: '1px solid var(--blush3)', borderRadius: '50px', fontSize: '12px', fontWeight: 600, color: 'var(--muted2)' }}>+ more on request</span>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: '12px' }}>📞 Get in Touch</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href={`tel:${s.contact_phone}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--ink)', fontSize: '13px', fontWeight: 500 }}>
                  <span style={{ width: 32, height: 32, background: 'var(--blush)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>📞</span>
                  {s.contact_phone}
                </a>
                <a href={`mailto:${s.contact_email}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--ink)', fontSize: '13px', fontWeight: 500 }}>
                  <span style={{ width: 32, height: 32, background: 'var(--blush)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>✉️</span>
                  {s.contact_email}
                </a>
              </div>
            </div>

            <a href={`https://wa.me/${s.contact_whatsapp}?text=Hi%20Sri%20Pujitha!%20I%20would%20like%20to%20book%20a%20makeup%20appointment.`}
              target="_blank" rel="noopener"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', background: '#25D366', borderRadius: '12px', textDecoration: 'none', color: '#fff', fontSize: '14px', fontWeight: 700 }}>
              💬 Book via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
