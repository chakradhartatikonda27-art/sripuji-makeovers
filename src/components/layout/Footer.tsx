'use client'

import { useEffect, useState } from 'react'
import { useMobile } from '@/context/MobileContext'

import Link from 'next/link'
import { NAV_LINKS, SITE } from '@/lib/constants'

export default function Footer() {
  const { isMobile, isTablet } = useMobile()
  
  const [s, setS] = useState({
    contact_phone:   SITE.phoneDisplay,
    contact_email:   SITE.email,
    contact_address: SITE.address,
    contact_whatsapp: SITE.whatsapp.replace('https://wa.me/', ''),
  })

  useEffect(() => {
    fetch('/api/site-settings').then(r => r.json())
      .then(d => { if (d && !d.error) setS(prev => ({ ...prev, ...d })) })
      .catch(() => {})
  }, [])

  return (
    <footer style={{ background: '#111', color: 'rgba(255,255,255,0.6)', padding: '56px 6% 32px', fontFamily: 'var(--font-inter)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1.5fr 1fr 1fr 1.2fr', gap: isMobile ? '28px' : '40px', marginBottom: '48px' }}>

          {/* Brand */}
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: '6px' }}>
              Sripuji <span style={{ color: 'var(--coral)' }}>Makeovers</span>
            </div>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '14px' }}>
              Professional Makeup Artist
            </div>
            <p style={{ fontSize: '12px', lineHeight: 1.8, maxWidth: '220px' }}>
              Glamorous, minimalistic &amp; smokey-eyed bridal looks. Travels to your venue across East Godavari.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <a href={SITE.instagram} target="_blank" rel="noopener"
                style={{ width: 34, height: 34, borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--coral)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>📸</a>
              <a href={SITE.youtube} target="_blank" rel="noopener"
                style={{ width: 34, height: 34, borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FF0000')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>▶️</a>
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', marginBottom: '16px' }}>Services</div>
            {['Bridal Makeup','Engagement Makeup','Reception Makeup','Airbrush Makeup','Groom Makeup','Saree Draping'].map(s => (
              <Link key={s} href="/services" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                {s}
              </Link>
            ))}
          </div>

          {/* Navigate */}
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', marginBottom: '16px' }}>Navigate</div>
            {NAV_LINKS.filter(l => l.label !== 'Admin').map(l => (
              <Link key={l.label} href={l.href} style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', marginBottom: '16px' }}>Contact</div>
            {[
              { icon: '📞', val: s.contact_phone,   href: `tel:${s.contact_phone}` },
              { icon: '✉️', val: s.contact_email,   href: `mailto:${s.contact_email}` },
              { icon: '📍', val: s.contact_address, href: undefined },
            ].map(c => (
              <div key={c.icon} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{c.icon}</span>
                {c.href ? (
                  <a href={c.href} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', lineHeight: 1.5, transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                    {c.val}
                  </a>
                ) : (
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{c.val}</span>
                )}
              </div>
            ))}
            <a href={`https://wa.me/${s.contact_whatsapp}`} target="_blank" rel="noopener"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '8px', padding: '8px 16px', background: '#25D366', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: '#fff', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#22c55e')}
              onMouseLeave={e => (e.currentTarget.style.background = '#25D366')}>
              💬 WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '11px' }}>© {new Date().getFullYear()} Sripuji Makeovers. All rights reserved.</span>
          <span style={{ fontSize: '11px' }}>Made with ❤️ for Sri Pujitha</span>
        </div>
      </div>
    </footer>
  )
}
