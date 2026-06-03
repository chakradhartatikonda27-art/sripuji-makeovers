import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ServicesGrid from '@/components/sections/ServicesGrid'

export const metadata: Metadata = {
  title: 'Services & Pricing',
  description: 'Complete makeup services by Sripuji Makeovers — bridal, engagement, reception, groom, airbrush and more in Rajahmundry.',
}

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>
        <section style={{ background: '#fff', padding: '64px 6% 48px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="eyebrow-dash">Services & Pricing</div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)', marginBottom: '14px' }}>
              Complete Beauty <span style={{ color: 'var(--coral)' }}>Services</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.85, maxWidth: '540px' }}>
              All services include premium products, full preparation, and travel to your venue across Rajahmundry &amp; East Godavari.
            </p>
          </div>
        </section>

        <section style={{ background: 'var(--bg)', padding: '64px 6%' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <ServicesGrid />
          </div>
        </section>

        <section style={{ background: '#fff', padding: '64px 6%' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="eyebrow-dash">Booking Policy</div>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)', marginBottom: '32px' }}>
              Good to <span style={{ color: 'var(--coral)' }}>Know</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px' }}>
              {[
                { icon: '💰', title: '12% Advance', desc: 'A 12% advance booking amount is required to confirm and hold your date.' },
                { icon: '✅', title: 'Paid Trial', desc: 'Trial makeup is available. Trial cost is adjusted against your final booking.' },
                { icon: '✈️', title: 'Travels to Venue', desc: 'Sri Pujitha travels to your venue across Rajahmundry and East Godavari.' },
                { icon: '💄', title: 'Premium Products', desc: '100% genuine international products — NARS, MAC, Huda Beauty, Fenty and more.' },
              ].map(item => (
                <div key={item.title} style={{ background: 'var(--blush)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px 20px' }}>
                  <span style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }}>{item.icon}</span>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>{item.title}</div>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
