'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
})

export default function HeroSection() {
  return (
    <section style={{
      minHeight: '100vh', padding: '100px 6% 80px',
      display: 'flex', alignItems: 'center',
      background: '#fff', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', width: 650, height: 650, borderRadius: '50%', filter: 'blur(80px)', opacity: 0.10, background: '#F0635A', top: -180, right: -140, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', filter: 'blur(80px)', opacity: 0.07, background: '#FFB5B0', bottom: -90, left: -70, pointerEvents: 'none' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '56px', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>

        <div>
          <motion.div {...fade(0.05)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--blush)', border: '1px solid var(--blush3)', padding: '5px 14px', borderRadius: '50px', marginBottom: '22px', fontSize: '11px', fontWeight: 600, color: 'var(--coral)' }}>
            <span style={{ width: 6, height: 6, background: 'var(--coral)', borderRadius: '50%', animation: 'pulseDot 2s infinite', display: 'inline-block' }} />
            Est. 2023 · Rajahmundry, East Godavari
          </motion.div>

          <motion.h1 {...fade(0.12)} style={{ fontSize: 'clamp(38px,5.5vw,68px)', fontWeight: 800, letterSpacing: '-1.5px', color: 'var(--ink)', lineHeight: 1.05, marginBottom: '8px' }}>
            Sri Pujitha<br /><span style={{ color: 'var(--coral)' }}>Makeup Artist</span>
          </motion.h1>

          <motion.p {...fade(0.18)} style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3.5px', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: '22px' }}>
            Sripuji Makeovers
          </motion.p>

          <motion.div {...fade(0.22)} style={{ width: 36, height: 3, background: 'var(--coral)', borderRadius: 2, marginBottom: '18px' }} />

          <motion.p {...fade(0.28)} style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(17px,2.2vw,24px)', fontStyle: 'italic', color: 'var(--ink2)', lineHeight: 1.45, marginBottom: '14px' }}>
            "Where every bride feels beautifully herself."
          </motion.p>

          <motion.p {...fade(0.34)} style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.85, maxWidth: '460px', marginBottom: '32px' }}>
            Specialising in glamorous, minimalistic &amp; smokey-eyed bridal looks. 100% genuine premium international products. Travels to your venue across Rajahmundry &amp; East Godavari.
          </motion.p>

          <motion.div {...fade(0.40)} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <Link href="/booking" style={{ background: 'var(--coral)', color: '#fff', padding: '13px 28px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(240,99,90,0.30)', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
              Book Appointment
            </Link>
            <Link href="/services" style={{ background: '#fff', color: 'var(--coral)', padding: '12px 24px', borderRadius: '6px', border: '2px solid var(--blush3)', fontSize: '12px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}>
              View Services
            </Link>
            <a href="https://wa.me/918885397517" target="_blank" rel="noopener" style={{ background: '#25D366', color: '#fff', padding: '12px 20px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(37,211,102,0.28)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </motion.div>

          <motion.div {...fade(0.48)} style={{ display: 'flex', borderTop: '1px solid var(--border)', paddingTop: '28px' }}>
            {[
              { n: '500+', l: 'Happy Clients' },
              { n: '11+',  l: 'Services' },
              { n: '100%', l: 'Premium Products' },
              { n: '✈',   l: 'Travels to Venue' },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', paddingRight: i < 3 ? '16px' : 0, paddingLeft: i > 0 ? '16px' : 0, borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--coral)', display: 'block', lineHeight: 1, letterSpacing: '-1px' }}>{s.n}</span>
                <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px', display: 'block' }}>{s.l}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'linear-gradient(145deg,var(--blush),var(--blush2))', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 170, height: 170, borderRadius: '50%', background: 'var(--coral)', opacity: 0.06 }} />
            <span style={{ fontSize: '42px', display: 'block', marginBottom: '12px' }}>💄</span>
            <div style={{ fontSize: '19px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.4px', marginBottom: '3px' }}>Sri Pujitha</div>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--coral)' }}>Professional Makeup Artist</div>
            <div style={{ width: '26px', height: '2px', background: 'var(--coral)', borderRadius: '2px', margin: '12px 0' }} />
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.65 }}>Freelance bridal makeup artist · Rajahmundry · Travels to venue across East Godavari, AP</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: '11px' }}>
            <div style={{ width: 9, height: 9, background: '#25D366', borderRadius: '50%', animation: 'pulseDot 2s infinite', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Available for Bookings</div>
              <div style={{ fontSize: '10px', color: 'var(--muted2)' }}>Rajahmundry &amp; East Godavari</div>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '13px 16px' }}>
            <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: '8px' }}>Premium Products Used</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {['NARS','Huda Beauty','MAC','Fenty','Bobbi Brown','+7 more'].map(b => (
                <span key={b} style={{ padding: '3px 9px', background: 'var(--blush)', borderRadius: '50px', fontSize: '10px', fontWeight: 600, color: 'var(--coral)' }}>{b}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
