'use client'

import { motion } from 'framer-motion'
import { TESTIMONIALS } from '@/lib/constants'

export default function TestimonialsSection() {
  return (
    <section id="reviews" style={{ background: 'var(--blush)', padding: '96px 6%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="eyebrow-dash center">Client Reviews</div>
          <h2 style={{ fontSize: 'clamp(26px,3.8vw,42px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)', marginBottom: '12px' }}>
            What Our <span style={{ color: 'var(--coral)' }}>Brides Say</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.85, maxWidth: '500px', margin: '0 auto' }}>
            Real feedback from real clients who trusted us with their most important day.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px 24px', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(240,99,90,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--blush3)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
              <div style={{ color: 'var(--coral)', fontSize: '12px', letterSpacing: '2px', marginBottom: '12px' }}>{'★'.repeat(t.rating)}</div>
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '15px', fontStyle: 'italic', lineHeight: 1.8, color: 'var(--ink2)', marginBottom: '16px' }}>"{t.text}"</p>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--coral)' }}>{t.author}</div>
              <div style={{ fontSize: '10px', color: 'var(--muted2)', marginTop: '2px', fontWeight: 500 }}>{t.event}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
