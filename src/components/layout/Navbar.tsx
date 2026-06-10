'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS, SITE } from '@/lib/constants'
import { useBreakpoint } from '@/hooks/useBreakpoint'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const pathname  = usePathname()
  const { isMobile, isTablet } = useBreakpoint()
  const showHamburger = isMobile || isTablet

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        height: '68px',
        background: scrolled || open ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
            Sripuji <span style={{ color: 'var(--coral)' }}>Makeovers</span>
          </div>
          {!isMobile && (
            <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)' }}>
              Professional Makeup Artist · Rajahmundry
            </div>
          )}
        </Link>

        {/* Desktop nav links */}
        {!showHamburger && (
          <ul style={{ display: 'flex', gap: '28px', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
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
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!showHamburger && (
            <Link href="/booking" style={{
              padding: '9px 20px', background: 'var(--coral)', color: '#fff',
              borderRadius: '50px', fontSize: '12px', fontWeight: 700,
              textDecoration: 'none', transition: 'all 0.2s',
              boxShadow: '0 4px 14px rgba(240,99,90,0.3)',
            }}>
              BOOK NOW
            </Link>
          )}

          {/* Mobile Book Now + Hamburger */}
          {showHamburger && (
            <>
              <Link href="/booking" style={{
                padding: '8px 16px', background: 'var(--coral)', color: '#fff',
                borderRadius: '50px', fontSize: '11px', fontWeight: 700,
                textDecoration: 'none',
              }}>
                Book
              </Link>
              <button onClick={() => setOpen(!open)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {open ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                )}
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && showHamburger && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: '68px', left: 0, right: 0, zIndex: 998,
              background: '#fff', borderBottom: '1px solid var(--border)',
              padding: '16px 5% 24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}>
            {NAV_LINKS.map((link, i) => (
              <motion.div key={link.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}>
                <Link href={link.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block', padding: '13px 0',
                    fontSize: '16px', fontWeight: pathname === link.href ? 700 : 500,
                    color: pathname === link.href ? 'var(--coral)' : 'var(--ink)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--border)',
                  }}>
                  {link.label}
                  {pathname === link.href && <span style={{ color: 'var(--coral)', marginLeft: '8px' }}>←</span>}
                </Link>
              </motion.div>
            ))}
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <a href={`https://wa.me/${SITE.phone.replace('+', '')}`} target="_blank" rel="noopener"
                style={{ flex: 1, padding: '12px', background: '#25D366', color: '#fff', borderRadius: '10px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                💬 WhatsApp
              </a>
              <Link href="/booking" onClick={() => setOpen(false)}
                style={{ flex: 1, padding: '12px', background: 'var(--coral)', color: '#fff', borderRadius: '10px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                📅 Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
