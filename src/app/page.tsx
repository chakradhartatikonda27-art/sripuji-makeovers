import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import TickerSection from '@/components/sections/TickerSection'
import WhyChooseSection from '@/components/sections/WhyChooseSection'
import AboutSection from '@/components/sections/AboutSection'
import ServicesGrid from '@/components/sections/ServicesGrid'
import BrandsSection from '@/components/sections/BrandsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import LocationSection from '@/components/sections/LocationSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TickerSection />
        <WhyChooseSection />
      <AboutSection />
        <section style={{ background: 'var(--bg)', padding: '96px 6%' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div className="eyebrow-dash center">Services & Pricing</div>
              <h2 style={{ fontSize: 'clamp(26px,3.8vw,42px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)', marginBottom: '12px' }}>
                Everything for <span style={{ color: 'var(--coral)' }}>Your Special Day</span>
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.85, maxWidth: '500px', margin: '0 auto' }}>
                All services include premium products, full preparation, and travel to your venue.
              </p>
            </div>
            <ServicesGrid limit={6} />
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link href="/services" style={{ background: '#fff', color: 'var(--coral)', padding: '12px 28px', borderRadius: '6px', border: '2px solid var(--blush3)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                View All 11 Services →
              </Link>
            </div>
          </div>
        </section>
        <BrandsSection />
        <TestimonialsSection />
        <LocationSection />
        <section style={{ background: 'var(--coral)', padding: '80px 6%', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,38px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: '14px' }}>
            Ready to Look Stunning on Your Special Day?
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', maxWidth: '460px', margin: '0 auto 32px' }}>
            Book your appointment and let Sri Pujitha craft your perfect look.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/booking" style={{ background: '#fff', color: 'var(--coral)', padding: '14px 32px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
              Book Now
            </Link>
            <a href="https://wa.me/918885397517" target="_blank" rel="noopener"
              style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', padding: '13px 24px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              WhatsApp Us
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
