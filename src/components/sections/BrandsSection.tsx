'use client'

import { BRANDS } from '@/lib/constants'

export default function BrandsSection() {
  return (
    <section style={{ background: '#fff', padding: '64px 6%' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <div className="eyebrow-dash center">Products We Use</div>
        <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)', marginBottom: '12px' }}>
          Only <span style={{ color: 'var(--coral)' }}>Genuine Premium</span> Brands
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.85, maxWidth: '500px', margin: '0 auto 36px' }}>
          100% authentic international products — your skin deserves the best.
        </p>
      </div>
      <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '18px 0', margin: '0 6%' }}>
        <div className="marquee-track">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} style={{ padding: '0 28px', fontSize: '13px', fontWeight: 700, color: 'var(--muted2)', whiteSpace: 'nowrap', borderRight: '1px solid var(--border)', cursor: 'default', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--coral)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted2)')}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
