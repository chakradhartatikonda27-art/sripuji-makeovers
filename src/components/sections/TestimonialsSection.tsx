'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TESTIMONIALS } from '@/lib/constants'


interface Testimonial {
  id?: string
  author: string
  event: string
  text: string
  rating: number
}

export default function TestimonialsSection() {
  
  const [items, setItems] = useState<Testimonial[]>(TESTIMONIALS)

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.filter((t: any) => t.is_active !== false))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="reviews" style={{ background: 'var(--bg)', padding: '80px 6%', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="eyebrow-dash" style={{ justifyContent: 'center' }}>Reviews</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)', lineHeight: 1.1 }}>
            What Brides <span style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: 'var(--coral)', fontWeight: 600 }}>Are Saying</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {items.map((t, i) => (
            <motion.div key={t.id || i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: t.rating || 5 }).map((_, j) => (
                  <span key={j} style={{ fontSize: '14px' }}>⭐</span>
                ))}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.8, fontStyle: 'italic', flex: 1 }}>
                "{t.text}"
              </p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>{t.author}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted2)', marginTop: '2px' }}>{t.event}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
