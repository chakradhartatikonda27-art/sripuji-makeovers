import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PortfolioGrid from '@/components/sections/PortfolioGrid'
import InstagramFeed from '@/components/sections/InstagramFeed'


const YT_VIDEOS = [
  { id: 'UCIvr6tmV__RnczpydCsuIfA', title: 'Bridal Makeup Transformation', thumb: 'https://img.youtube.com/vi/default/maxresdefault.jpg' },
]

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>

        {/* Portfolio Grid */}
        <section style={{ background: '#fff', padding: '64px 6% 32px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)', lineHeight: 1.1, marginBottom: '10px' }}>
              Real Work, <span style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: 'var(--coral)', fontWeight: 600 }}>Real Brides</span>
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.8, maxWidth: '480px', marginBottom: '28px' }}>
              A glimpse into real transformations — each look handcrafted with care and artistry.
            </p>
            <PortfolioGrid />
          </div>
        </section>

        {/* YouTube Section */}
        <section style={{ background: 'var(--bg)', padding: '64px 6%', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#FF0000', marginBottom: '6px' }}>▶ YouTube Channel</div>
                <h2 style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)' }}>
                  Watch the <span style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: 'var(--coral)' }}>Transformation</span>
                </h2>
              </div>
              <a href="https://www.youtube.com/channel/UCIvr6tmV__RnczpydCsuIfA" target="_blank" rel="noopener"
                style={{ background: '#FF0000', color: '#fff', padding: '10px 22px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                Subscribe
              </a>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <iframe
                src="https://www.youtube.com/embed?listType=user_uploads&list=UCIvr6tmV__RnczpydCsuIfA"
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Sripuji Makeovers YouTube Channel"
              />
            </div>
          </div>
        </section>

        {/* Instagram Feed */}
        <InstagramFeed />

      </main>
      <Footer />
    </>
  )
}
