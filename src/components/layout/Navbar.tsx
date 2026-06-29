'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/lib/constants'
import { AnimatePresence, motion } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('scroll', fn)
    }
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        height: '68px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 5%',
        background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.3s',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--ink)', lineHeight: 1 }}>
            Sripuji <span style={{ color: 'var(--coral)' }}>Makeovers</span>
          </div>
          {!isMobile && (
            <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)' }}>
              Professional Makeup Artist · Rajahmundry
            </div>
          )}
        </Link>

        {/* Desktop nav */}
        {!isMobile && (
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
          {!isMobile && (
            <>
              <a href="tel:+918885397517" style={{ fontSize:'12px', fontWeight:700, color:'var(--coral)', textDecoration:'none', display:'flex', alignItems:'center', gap:'4px', whiteSpace:'nowrap' }}>
                📞 +91 88853 97517
              </a>
              <Link href="/booking" style={{ padding:'9px 20px', background:'var(--coral)', color:'#fff', borderRadius:'50px', fontSize:'12px', fontWeight:700, textDecoration:'none', boxShadow:'0 4px 14px rgba(240,99,90,0.3)' }}>
                BOOK NOW
              </Link>
            </>
          )}

          {isMobile && (
            <>
              <Link href="/booking" style={{ padding:'8px 16px', background:'var(--coral)', color:'#fff', borderRadius:'50px', fontSize:'11px', fontWeight:700, textDecoration:'none' }}>
                Book
              </Link>
              <button onClick={() => setOpen(!open)}
                style={{ background:'none', border:'none', cursor:'pointer', padding:'6px', display:'flex', alignItems:'center' }}>
                {open
                  ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                }
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && isMobile && (
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.2 }}
            style={{ position:'fixed', top:'68px', left:0, right:0, zIndex:998, background:'#fff', borderBottom:'1px solid var(--border)', padding:'16px 5% 24px', boxShadow:'0 8px 32px rgba(0,0,0,0.1)' }}>
            {NAV_LINKS.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}>
                <Link href={link.href} onClick={() => setOpen(false)}
                  style={{ display:'block', padding:'12px 0', fontSize:'15px', fontWeight:600, color: pathname === link.href ? 'var(--coral)' : 'var(--ink)', textDecoration:'none', borderBottom:'1px solid var(--border)' }}>
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <a href="tel:+918885397517" style={{ display:'block', marginTop:'16px', padding:'12px 0', fontSize:'15px', fontWeight:700, color:'var(--coral)', textDecoration:'none' }}>
              📞 +91 88853 97517
            </a>
            <a href="https://wa.me/918885397517" target="_blank" rel="noopener" style={{ display:'block', marginTop:'8px', padding:'12px 20px', background:'#25D366', color:'#fff', borderRadius:'8px', fontSize:'14px', fontWeight:700, textDecoration:'none', textAlign:'center' }}>
              💬 WhatsApp Us
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
