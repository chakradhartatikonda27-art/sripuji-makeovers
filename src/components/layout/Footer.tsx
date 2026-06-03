'use client'

import Link from 'next/link'
import { SITE } from '@/lib/constants'

export default function Footer() {
  return (
    <footer style={{ background: '#111', padding: '52px 6% 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '36px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '36px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <span style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', display: 'block', marginBottom: '8px' }}>
            Sripuji <span style={{ color: '#F5857E' }}>Makeovers</span>
          </span>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.85 }}>
            Professional makeup artist in Rajahmundry. Bridal, engagement & function makeup with 100% genuine premium international products since 2023.
          </p>
        </div>
        {[
          { title: 'Services', links: [
            { label: 'Bridal Makeup',     href: '/services' },
            { label: 'Engagement Makeup', href: '/services' },
            { label: 'Reception Makeup',  href: '/services' },
            { label: 'Groom Makeup',      href: '/services' },
            { label: 'Airbrush Makeup',   href: '/services' },
          ]},
          { title: 'Navigate', links: [
            { label: 'About',     href: '/#about' },
            { label: 'Portfolio', href: '/portfolio' },
            { label: 'Reviews',   href: '/#reviews' },
            { label: 'Book Now',  href: '/booking' },
            { label: 'Contact',   href: '/contact' },
          ]},
          { title: 'Contact', links: [
            { label: SITE.phoneDisplay,         href: `tel:${SITE.phone}` },
            { label: SITE.email,                href: `mailto:${SITE.email}` },
            { label: '@sripuji_makeovers',      href: SITE.instagram },
            { label: 'WhatsApp',                href: SITE.whatsapp },
            { label: 'Rajahmundry, AP',         href: '#' },
          ]},
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(240,99,90,0.65)', marginBottom: '14px' }}>
              {col.title}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {col.links.map(link => (
                <li key={link.label}>
                  <Link href={link.href} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1200px', margin: '20px auto 0', fontSize: '10px', color: 'rgba(255,255,255,0.2)', flexWrap: 'wrap', gap: '8px' }}>
        <span>© {new Date().getFullYear()} Sripuji Makeovers · Sri Pujitha. All rights reserved.</span>
        <span>Built with Next.js + Supabase + Vercel</span>
      </div>
    </footer>
  )
}
