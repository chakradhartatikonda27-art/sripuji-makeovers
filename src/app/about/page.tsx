'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import AboutSection from '@/components/sections/AboutSection'
import Footer from '@/components/layout/Footer'
import { useMobile } from '@/context/MobileContext'

export default function AboutPage() {
  const { isMobile } = useMobile()
  const [s, setS] = useState<Record<string, string>>({
    hero_name: 'Sri Pujitha',
    hero_title: 'Makeup Artist',
    hero_quote: 'Where every bride feels beautifully herself.',
    hero_description: 'Specialising in glamorous, minimalistic & smokey-eyed bridal looks. 100% genuine premium international products. Travels to your venue across Rajahmundry & East Godavari.',
    hero_availability: 'Rajahmundry & East Godavari',
    hero_brands: 'NARS,Huda Beauty,MAC,Fenty,Bobbi Brown,Tarte,Laura Mercier,Inglot',
    hero_stat1: '500+', hero_stat1_lbl: 'Brides Transformed',
    hero_stat2: '11+',  hero_stat2_lbl: 'Services',
    hero_stat3: '100%', hero_stat3_lbl: 'Premium Kit',
    hero_stat4: '✈️',   hero_stat4_lbl: 'Travels to Venue',
    about_photo_url: '',
    contact_whatsapp: '918885397517',
  })

  useEffect(() => {
    fetch('/api/site-settings').then(r => r.json())
      .then(d => { if (d && !d.error) setS(prev => ({ ...prev, ...d })) })
      .catch(() => {})
  }, [])

  const brands = (s.hero_brands || '').split(',').filter(Boolean).map(b => b.trim())
  const stats = [
    { n: s.hero_stat1, l: s.hero_stat1_lbl },
    { n: s.hero_stat2, l: s.hero_stat2_lbl },
    { n: s.hero_stat3, l: s.hero_stat3_lbl },
    { n: s.hero_stat4, l: s.hero_stat4_lbl },
  ]

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>
        <section style={{ background: '#fff', padding: isMobile ? '32px 5% 40px' : '80px 6% 64px', borderBottom: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>

          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,99,90,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 400px', gap: isMobile ? '40px' : '60px', alignItems: 'center', position: 'relative', zIndex: 1 }}>

            {/* LEFT — same as hero */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '28px', height: '2px', background: 'var(--coral)', borderRadius: '2px' }} />
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: 'var(--coral)' }}>Sripuji Makeovers</span>
              </div>
              <h1 style={{ fontSize: isMobile ? '48px' : 'clamp(44px,5.5vw,68px)', fontWeight: 800, letterSpacing: '-2px', color: 'var(--ink)', lineHeight: 1, marginBottom: '4px' }}>
                {s.hero_name}
              </h1>
              <h2 style={{ fontSize: isMobile ? '44px' : 'clamp(40px,5vw,62px)', fontWeight: 800, letterSpacing: '-2px', color: 'var(--coral)', lineHeight: 1, marginBottom: '24px' }}>
                {s.hero_title}
              </h2>
              <p style={{ fontSize: isMobile ? '16px' : '18px', fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: 'var(--muted)', marginBottom: '12px', lineHeight: 1.6 }}>
                &ldquo;{s.hero_quote}&rdquo;
              </p>
              <p style={{ fontSize: '14px', color: 'var(--muted2)', lineHeight: 1.85, marginBottom: '32px', maxWidth: '460px' }}>
                {s.hero_description}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row', marginBottom: '36px' }}>
                <Link href="/booking" style={{ padding: isMobile ? '13px 24px' : '14px 28px', background: 'var(--coral)', color: '#fff', borderRadius: '50px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', textAlign: 'center' as const, boxShadow: '0 6px 24px rgba(240,99,90,0.35)', display: 'block' }}>
                  📅 Book Appointment
                </Link>
                <Link href="/services" style={{ padding: isMobile ? '13px 24px' : '14px 28px', background: '#fff', color: 'var(--ink)', borderRadius: '50px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', textAlign: 'center' as const, border: '2px solid var(--border)', display: 'block' }}>
                  View Services
                </Link>
                <a href={`https://wa.me/${s.contact_whatsapp}`} target="_blank" rel="noopener" style={{ padding: isMobile ? '13px 24px' : '14px 28px', background: '#fff', color: '#25D366', borderRadius: '50px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', textAlign: 'center' as const, border: '2px solid #25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  💬 WhatsApp
                </a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '8px' }}>
                {stats.map(k => (
                  <div key={k.l} style={{ textAlign: 'center', padding: isMobile ? '12px 8px' : '14px 8px', background: 'var(--blush)', borderRadius: '12px', border: '1px solid var(--blush3)' }}>
                    <div style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 800, color: 'var(--coral)', letterSpacing: '-0.5px', lineHeight: 1 }}>{k.n}</div>
                    <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, color: 'var(--muted2)', marginTop: '4px' }}>{k.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT CARD */}
            {!isMobile && (
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
                <div style={{ background: 'linear-gradient(145deg, #FFF5F4 0%, #fff 60%)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(240,99,90,0.15)', boxShadow: '0 24px 64px rgba(240,99,90,0.12), 0 4px 16px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', padding: '14px', background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '12px', overflow: 'hidden', background: 'var(--blush)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {s.about_photo_url
                        ? <img src={s.about_photo_url} alt="Sri Pujitha" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '26px' }}>💄</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink)' }}>{s.hero_name}</div>
                      <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--coral)', marginTop: '3px' }}>Professional Makeup Artist</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted2)', marginTop: '3px' }}>📍 {s.hero_availability}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', marginBottom: '12px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#15803D' }}>Available for Bookings</div>
                      <div style={{ fontSize: '10px', color: '#166534' }}>{s.hero_availability}</div>
                    </div>
                  </div>
                  <div style={{ padding: '12px 14px', background: '#fff', borderRadius: '10px', marginBottom: '14px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--muted2)', marginBottom: '8px' }}>Premium Products Used</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {brands.slice(0, 6).map(b => (
                        <span key={b} style={{ padding: '3px 9px', background: 'var(--blush)', border: '1px solid var(--blush3)', borderRadius: '50px', fontSize: '10px', fontWeight: 600, color: 'var(--coral)' }}>{b}</span>
                      ))}
                      {brands.length > 6 && <span style={{ padding: '3px 9px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '50px', fontSize: '10px', fontWeight: 600, color: 'var(--muted2)' }}>+{brands.length - 6}</span>}
                    </div>
                  </div>
                  <Link href="/booking" style={{ display: 'block', width: '100%', padding: '13px', background: 'var(--coral)', color: '#fff', borderRadius: '12px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', textAlign: 'center' as const, boxShadow: '0 4px 16px rgba(240,99,90,0.3)' }}>
                    📅 Book Your Appointment
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* About bio section below */}
        <AboutSection />
      </main>
      <Footer />
    </>
  )
}
