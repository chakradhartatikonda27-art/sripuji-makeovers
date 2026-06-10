'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BRANDS } from '@/lib/constants'

export default function HeroSection() {
  const [s, setS] = useState<Record<string, string>>({
    hero_name:        'Sri Pujitha',
    hero_title:       'Makeup Artist',
    hero_quote:       'Where every bride feels beautifully herself.',
    hero_description: 'Specialising in glamorous, minimalistic & smokey-eyed bridal looks. 100% genuine premium international products. Travels to your venue across Rajahmundry & East Godavari.',
    hero_availability:'Rajahmundry & East Godavari',
    hero_brands:      'NARS,Huda Beauty,MAC,Fenty,Bobbi Brown,Tarte,Laura Mercier,Inglot',
    about_stat1:      '500+', about_stat1_lbl: 'Happy Clients',
    about_stat3:      '11+',  about_stat3_lbl: 'Services',
    about_stat4:      '100%', about_stat4_lbl: 'Premium Products',
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
  const extraCount = brands.length - 5

  const stats = [
    { n: s.about_stat1, l: s.about_stat1_lbl },
    { n: s.about_stat3, l: s.about_stat3_lbl },
    { n: s.about_stat4, l: s.about_stat4_lbl },
    { n: '✈️', l: 'Travels to Venue' },
  ]

  return (
    <section style={{ background: '#fff', padding: '80px 6% 64px', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>

        {/* Left — Text */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: '16px' }}>
            Sripuji Makeovers
          </div>
          <h1 style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 800, letterSpacing: '-2px', color: 'var(--ink)', lineHeight: 1, marginBottom: '4px' }}>
            {s.hero_name}
          </h1>
          <h2 style={{ fontSize: 'clamp(36px,5.5vw,66px)', fontWeight: 800, letterSpacing: '-2px', color: 'var(--coral)', lineHeight: 1, marginBottom: '20px' }}>
            {s.hero_title}
          </h2>
          <div style={{ width: '40px', height: '3px', background: 'var(--coral)', borderRadius: '2px', marginBottom: '20px' }} />
          <p style={{ fontSize: 'clamp(16px,1.8vw,20px)', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.5 }}>
            "{s.hero_quote}"
          </p>
          <p style={{ fontSize: '14px', color: 'var(--muted2)', lineHeight: 1.8, marginBottom: '28px', maxWidth: '460px' }}>
            {s.hero_description}
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <Link href="/booking"
              style={{ padding: '13px 28px', background: 'var(--coral)', color: '#fff', borderRadius: '50px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(240,99,90,0.35)', transition: 'all 0.2s', display: 'inline-block' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              Book Appointment
            </Link>
            <Link href="/services"
              style={{ padding: '13px 28px', background: 'transparent', color: 'var(--ink)', borderRadius: '50px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', border: '1.5px solid var(--border)', transition: 'all 0.2s', display: 'inline-block' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ink)' }}>
              View Services
            </Link>
            <a href={`https://wa.me/${s.contact_whatsapp}`} target="_blank" rel="noopener"
              style={{ padding: '13px 28px', background: '#25D366', color: '#fff', borderRadius: '50px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#22c55e')}
              onMouseLeave={e => (e.currentTarget.style.background = '#25D366')}>
              💬 WhatsApp
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
            {stats.map(k => (
              <div key={k.l} style={{ textAlign: 'center', padding: '12px 8px', background: 'var(--blush)', borderRadius: '10px', border: '1px solid var(--blush3)' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--coral)', letterSpacing: '-0.5px', lineHeight: 1 }}>{k.n}</div>
                <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted2)', marginTop: '4px', lineHeight: 1.3 }}>{k.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Card */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          <div style={{ background: 'linear-gradient(155deg, var(--blush) 0%, #fff 100%)', borderRadius: '24px', padding: '32px', border: '1px solid var(--blush3)', boxShadow: '0 20px 60px rgba(240,99,90,0.12)' }}>

            {/* Artist profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', padding: '16px', background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '12px', overflow: 'hidden', background: 'var(--blush3)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.about_photo_url ? (
                  <img src={s.about_photo_url} alt="Sri Pujitha" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '28px' }}>💄</span>
                )}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>{s.hero_name}</div>
                <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--coral)', marginTop: '2px' }}>Professional Makeup Artist</div>
                <div style={{ fontSize: '11px', color: 'var(--muted2)', marginTop: '3px', lineHeight: 1.5 }}>
                  Freelance bridal makeup artist · Rajahmundry · Travels to venue across {s.hero_availability}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#fff', borderRadius: '10px', marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0, boxShadow: '0 0 0 3px rgba(34,197,94,0.2)' }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Available for Bookings</div>
                <div style={{ fontSize: '10px', color: 'var(--muted2)' }}>{s.hero_availability}</div>
              </div>
            </div>

            {/* Brands */}
            <div style={{ padding: '14px 16px', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: '10px' }}>Premium Products Used</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {visibleBrands.map(b => (
                  <span key={b} style={{ padding: '4px 10px', background: 'var(--blush)', border: '1px solid var(--blush3)', borderRadius: '50px', fontSize: '11px', fontWeight: 600, color: 'var(--coral)' }}>{b}</span>
                ))}
                {extraCount > 0 && (
                  <span style={{ padding: '4px 10px', background: 'var(--blush)', border: '1px solid var(--blush3)', borderRadius: '50px', fontSize: '11px', fontWeight: 600, color: 'var(--muted2)' }}>+{extraCount} more</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
