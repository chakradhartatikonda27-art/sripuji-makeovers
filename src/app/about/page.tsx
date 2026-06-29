'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import AboutSection from '@/components/sections/AboutSection'
import Footer from '@/components/layout/Footer'

export default function AboutPage() {
  const [s, setS] = useState<Record<string, string>>({
    hero_name: 'Sri Pujitha',
    hero_availability: 'Rajahmundry & East Godavari',
    hero_brands: 'NARS,Huda Beauty,MAC,Fenty,Bobbi Brown,Tarte,Laura Mercier,Inglot',
    about_photo_url: '',
  })

  useEffect(() => {
    fetch('/api/site-settings').then(r => r.json())
      .then(d => { if (d && !d.error) setS(prev => ({ ...prev, ...d })) })
      .catch(() => {})
  }, [])

  const brands = (s.hero_brands || '').split(',').filter(Boolean).map(b => b.trim())

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>
        {/* Artist Card */}
        <section style={{ background: 'var(--blush)', padding: '32px 6%', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(145deg, #FFF5F4 0%, #fff 60%)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(240,99,90,0.15)', boxShadow: '0 24px 64px rgba(240,99,90,0.12)' }}>
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
          </div>
        </section>
        <AboutSection />
      </main>
      <Footer />
    </>
  )
}
