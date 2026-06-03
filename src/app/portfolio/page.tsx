import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PortfolioGrid from '@/components/sections/PortfolioGrid'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Real work, real brides — portfolio of Sripuji Makeovers bridal and function makeup looks.',
}

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>
        <section style={{ background: '#fff', padding: '64px 6% 32px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)', lineHeight: 1.1, marginBottom: '10px' }}>
              Real Work, <span style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: 'var(--coral)', fontWeight: 600 }}>Real Brides</span>
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.8, maxWidth: '480px', marginBottom: '28px' }}>
              A glimpse into real transformations — each look handcrafted with care and artistry.
            </p>
          </div>
        </section>
        <section style={{ background: '#fff', padding: '32px 6% 64px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <PortfolioGrid />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
