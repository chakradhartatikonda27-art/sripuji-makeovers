'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PORTFOLIO_ITEMS } from '@/lib/constants'

const CATS = ['All', 'Bridal', 'Engagement', 'Function', 'Photoshoot', 'Groom']

export default function PortfolioGrid() {
  const [active, setActive] = useState('All')

  const items = active === 'All'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter(p => p.category === active)

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {CATS.map(cat => (
          <button key={cat} onClick={() => setActive(cat)}
            style={{
              padding: '8px 22px', borderRadius: '50px', fontSize: '10px', fontWeight: 700,
              letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
              border: `1.5px solid ${active === cat ? 'var(--coral)' : 'var(--border2)'}`,
              color: active === cat ? 'var(--coral)' : 'var(--muted2)',
              background: active === cat ? 'var(--blush)' : '#fff',
            }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0', border: '2px solid #fff' }}>
        {items.map((p, i) => (
          <motion.div key={p.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', border: '2px solid #fff', height: p.tall ? '320px' : '210px' }}
            onMouseEnter={e => {
              const bg = e.currentTarget.querySelector('.pi-bg') as HTMLElement
              const over = e.currentTarget.querySelector('.pi-over') as HTMLElement
              const lip = e.currentTarget.querySelector('.pi-lip') as HTMLElement
              if (bg) bg.style.transform = 'scale(1.06)'
              if (over) over.style.opacity = '1'
              if (lip) lip.style.opacity = '0.2'
            }}
            onMouseLeave={e => {
              const bg = e.currentTarget.querySelector('.pi-bg') as HTMLElement
              const over = e.currentTarget.querySelector('.pi-over') as HTMLElement
              const lip = e.currentTarget.querySelector('.pi-lip') as HTMLElement
              if (bg) bg.style.transform = 'scale(1)'
              if (over) over.style.opacity = '0'
              if (lip) lip.style.opacity = '0.5'
            }}>
            <div className="pi-bg" style={{ position: 'absolute', inset: 0, background: p.bg, transition: 'transform 0.5s' }} />
            <div className="pi-lip" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-58%)', fontSize: '48px', opacity: 0.5, zIndex: 1, pointerEvents: 'none', transition: 'opacity 0.3s' }}>💄</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 14px', zIndex: 2, background: 'linear-gradient(to top,rgba(0,0,0,0.25) 0%,transparent 100%)' }}>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '16px', fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.88)', lineHeight: 1.2, textShadow: '0 1px 8px rgba(0,0,0,0.2)' }}>
                {p.label}
              </div>
            </div>
            <div className="pi-over" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(217,79,71,0.82) 0%,transparent 52%)', opacity: 0, transition: 'opacity 0.3s', zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px 14px' }}>
              <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginBottom: '3px' }}>{p.category}</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '-0.2px' }}>{p.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
