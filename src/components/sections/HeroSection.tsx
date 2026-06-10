'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const [s, setS] = useState<Record<string, string>>({
    hero_name:        'Sri Pujitha',
    hero_title:       'Makeup Artist',
    hero_quote:       'Where every bride feels beautifully herself.',
    hero_description: 'Specialising in glamorous, minimalistic & smokey-eyed bridal looks. 100% genuine premium international products. Travels to your venue across Rajahmundry & East Godavari.',
    hero_availability:'Rajahmundry & East Godavari',
    hero_brands:      'NARS,Huda Beauty,MAC,Fenty,Bobbi Brown,Tarte,Laura Mercier,Inglot',
    hero_stat1: '500+', hero_stat1_lbl: 'Brides Transformed',
    hero_stat2: '11+',  hero_stat2_lbl: 'Services',
    hero_stat3: '100%', hero_stat3_lbl: 'Premium Kit',
    hero_stat4: '✈️',   hero_stat4_lbl: 'Travels to Venue',
    about_photo_url:  '',
    contact_whatsapp: '918885397517',
  })

  useEffect(() => {
    fetch('/api/site-settings').then(r => r.json())
      .then(d => { if (d && !d.error) setS(prev => ({ ...prev, ...d })) })
      .catch(() => {})
  }, [])

  const brands = (s.hero_brands || '').split(',').filter(Boolean).map(b => b.trim())
  const visibleBrands = brands.slice(0, 5)
  const extraCount = brands.length - visibleBrands.length

  const stats = [
    { n: s.hero_stat1, l: s.hero_stat1_lbl },
    { n: s.hero_stat2, l: s.hero_stat2_lbl },
    { n: s.hero_stat3, l: s.hero_stat3_lbl },
    { n: s.hero_stat4, l: s.hero_stat4_lbl },
  ]

  return (
    <section className="section-pad" style={{ background: '#fff', padding: '80px 6% 64px', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>

        {/* Left */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: '14px' }}>
            Sripuji Makeovers
          </div>
          <h1 style={{ fontSize: clamp(40px,6vw,72px), fontWeight: 800, letterSpacing: '-2px', color: 'var(--ink)', lineHeight: 1, marginBottom: '4px' }}>
            {s.hero_name}
          </h1>
          <h2 style={{ fontSize: clamp(36px,5.5vw,66px), fontWeight: 800, letterSpacing: '-2px', color: 'var(--coral)', lineHeight: 1, marginBottom: '18px' }}>
            {s.hero_title}
          </h2>
          <div style={{ width: '40px', height: '3px', background: 'var(--coral)', borderRadius: '2px', marginBottom: '18px' }} />
          <p style={{ fontSize: isMobile ? '17px' : 'clamp(16px,1.8vw,20px)', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: 'var(--muted)', marginBottom: '14px', lineHeight: 1.5 }}>
            "{s.hero_quote}"
          </p>
          <p style={{ fontSize: '14px', color: 'var(--muted2)', lineHeight: 1.8, marginBottom: '24px', maxWidth: '460px' }}>
            {s.hero_description}
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'row', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link href="/booking"
              style={{ padding: '13px 24px', background: 'var(--coral)', color: '#fff', borderRadius: '50px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(240,99,90,0.35)', transition: 'all 0.2s', display: 'inline-block', textAlign: 'center' }}>
              Book Appointment
            </Link>
            <Link href="/services"
              style={{ padding: '13px 24px', background: 'transparent', color: 'var(--ink)', borderRadius: '50px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', border: '1.5px solid var(--border)', transition: 'all 0.2s', display: 'inline-block', textAlign: 'center' }}>
              View Services
            </Link>
            <a href={`https://wa.me/${s.contact_whatsapp}`} target="_blank" rel="noopener"
              style={{ padding: '13px 24px', background: '#25D366', color: '#fff', borderRadius: '50px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              💬 WhatsApp
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
            {stats.map(k => (
              <div key={k.l} style={{ textAlign: 'center', padding: '10px 6px', background: 'var(--blush)', borderRadius: '10px', border: '1px solid var(--blush3)' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--coral)', letterSpacing: '-0.5px', lineHeight: 1 }}>{k.n}</div>
                <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted2)', marginTop: '4px', lineHeight: 1.3 }}>{k.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right card — hide on mobile */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <div style={{ background: 'linear-gradient(155deg, var(--blush) 0%, #fff 100%)', borderRadius: '24px', padding: '28px', border: '1px solid var(--blush3)', boxShadow: '0 20px 60px rgba(240,99,90,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', padding: '14px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ width: 52, height: 52, borderRadius: '10px', overflow: 'hidden', background: 'var(--blush3)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.about_photo_url ? (
                    <img src={s.about_photo_url} alt="Sri Pujitha" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <span style={{ fontSize: '26px' }}>💄</span>}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{s.hero_name}</div>
                  <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--coral)', marginTop: '2px' }}>Professional Makeup Artist</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted2)', marginTop: '3px', lineHeight: 1.5 }}>Travels to venue · {s.hero_availability}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', background: '#fff', borderRadius: '10px', marginBottom: '12px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0, boxShadow: '0 0 0 3px rgba(34,197,94,0.2)' }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Available for Bookings</div>
                  <div style={{ fontSize: '10px', color: 'var(--muted2)' }}>{s.hero_availability}</div>
                </div>
              </div>
              <div style={{ padding: '12px 14px', background: '#fff', borderRadius: '10px' }}>
                <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: '8px' }}>Premium Products Used</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {visibleBrands.map(b => (
                    <span key={b} style={{ padding: '3px 9px', background: 'var(--blush)', border: '1px solid var(--blush3)', borderRadius: '50px', fontSize: '10px', fontWeight: 600, color: 'var(--coral)' }}>{b}</span>
                  ))}
                  {extraCount > 0 && <span style={{ padding: '3px 9px', background: 'var(--blush)', border: '1px solid var(--blush3)', borderRadius: '50px', fontSize: '10px', fontWeight: 600, color: 'var(--muted2)' }}>+{extraCount} more</span>}
                </div>
              </div>
            </div>
          </motion.div>
      </div>
    </section>
  )
}
