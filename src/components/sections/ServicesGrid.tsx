'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { supabaseBrowser } from '@/lib/supabase'
import type { Service } from '@/types'

export default function ServicesGrid({ limit }: { limit?: number }) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading]   = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabaseBrowser()
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) { toast.error('Could not load services'); return }
        setServices(limit ? (data || []).slice(0, limit) : (data || []))
        setLoading(false)
      })
  }, [limit])

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '14px' }}>
      {Array.from({ length: limit || 6 }).map((_, i) => (
        <div key={i} style={{ height: '220px', background: 'var(--blush)', borderRadius: '12px', opacity: 0.6 }} />
      ))}
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '14px' }}>
      {services.map((s, i) => (
        <motion.div key={s.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.06 }}
          style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px 20px', transition: 'all 0.25s', cursor: 'default' }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(240,99,90,0.14)'
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.borderColor = 'var(--blush3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = 'var(--border)'
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '26px' }}>{s.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--blush3)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px', letterSpacing: '-0.2px' }}>{s.name}</div>
          <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '16px' }}>{s.description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--coral)', letterSpacing: '-0.5px', lineHeight: 1 }}>
                ₹{s.price.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--muted2)' }}>{s.unit}</div>
            </div>
            <button
              onClick={() => router.push(`/booking?service=${encodeURIComponent(s.name)}`)}
              style={{ background: 'var(--blush)', color: 'var(--coral)', border: '1.5px solid var(--blush3)', borderRadius: '6px', padding: '7px 14px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--coral)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--coral)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--blush)'; e.currentTarget.style.color = 'var(--coral)'; e.currentTarget.style.borderColor = 'var(--blush3)' }}>
              Book Now
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
