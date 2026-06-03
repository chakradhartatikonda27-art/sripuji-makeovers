'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS, SITE } from '@/lib/constants'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        height: '68px',
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 6%',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
            Sripuji <span style={{ color: 'var(--coral)' }}>Makeovers</span>
          </div>
          <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--muted2)' }}>
            Professional Makeup Artist · Rajahmundry
          </div>
        </Link>

        <ul style={{ display: 'flex', gap: '32px', listStyle: 'none', alignItems: 'center' }}
          className="hidden md:flex">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link href={link.href} style={{
                fontSize: '12px', fontWeight: 500,
                color: pathname === link.href ? 'var(--coral)' : 'var(--muted)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--coral)')}
                onMouseLeave={e => (e.currentTarget.style.color = pathname === link.href ? 'var(--coral)' : 'var(--muted)')}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/booking" className="hidden md:inline-flex" style={{
            background: 'var(--coral)', color: '#fff', padding: '10px 24px',
            borderRadius: '50px', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.5px', textTransform: 'uppercase',
            boxShadow: '0 4px 16px rgba(240,99,90,0.3)',
            textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--coral-d)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--coral)')}>
            Book Now
          </Link>
          <button onClick={() => setOpen(!open)} className="md:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', padding: '4px' }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{
              position: 'fixed', top: '68px', left: 0, right: 0, zIndex: 998,
              background: '#fff', borderBottom: '1px solid var(--border)',
              padding: '20px 6% 28px', display: 'flex', flexDirection: 'column', gap: '16px',
            }}>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                style={{ fontSize: '14px', fontWeight: 500, color: 'var(--muted)', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                {link.label}
              </Link>
            ))}
            <Link href="/booking" onClick={() => setOpen(false)} style={{
              background: 'var(--coral)', color: '#fff', padding: '12px 24px',
              borderRadius: '6px', textAlign: 'center', fontWeight: 700,
              fontSize: '13px', textDecoration: 'none', marginTop: '8px',
            }}>
              Book Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
