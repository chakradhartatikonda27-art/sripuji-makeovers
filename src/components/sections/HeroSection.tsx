'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [gallery, setGallery] = useState<string[]>([])
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [whatsapp, setWhatsapp] = useState('918885397517')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/site-settings').then(r => r.json())
      .then(d => { if (d?.contact_whatsapp) setWhatsapp(d.contact_whatsapp) })
      .catch(() => {})
    fetch('/api/hero-gallery').then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) setGallery(d) })
      .catch(() => {})
    setTimeout(() => setLoaded(true), 100)
  }, [])

  useEffect(() => {
    if (gallery.length < 2) return
    const t = setInterval(() => {
      setCurrentPhoto(p => {
        return (p + 1) % gallery.length
      })
    }, 3000)
    return () => clearInterval(t)
  }, [gallery.length])

  const FALLBACK = 'https://bdudqnctoynjtihJskph.supabase.co/storage/v1/object/public/portfolio/hero/1782657636951.JPG'
  const heroImg = gallery.length > 0 ? gallery[currentPhoto] : FALLBACK

  return (
    <>
      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #2d0a10 0%, #6b1a28 50%, #2d0a10 100%);
          z-index: 0;
        }
        .hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          z-index: 0;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%);
          z-index: 1;
        }
        .hero-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #F0635A;
          z-index: 3;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          width: 100%;
          max-width: 900px;
          padding: 80px 24px 60px;
          opacity: 1;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(240,99,90,0.2);
          border: 1px solid rgba(240,99,90,0.5);
          border-radius: 50px;
          padding: 5px 14px;
          margin-bottom: 16px;
        }
        .hero-badge span {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #F0635A;
        }
        .hero-h1 {
          font-size: clamp(24px, 5vw, 68px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin-bottom: 16px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }
        .hero-h1 span { color: #F0635A; }
        .hero-sub {
          font-size: clamp(12px, 1.8vw, 16px);
          color: rgba(255,255,255,0.9);
          margin-bottom: 36px;
          font-style: italic;
          line-height: 1.6;
        }
        .hero-btns {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .hero-btn-primary {
          padding: 15px 36px;
          background: #F0635A;
          color: #fff;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 8px 32px rgba(240,99,90,0.45);
          min-width: 180px;
          text-align: center;
          display: inline-block;
        }
        .hero-btn-secondary {
          padding: 15px 36px;
          background: rgba(255,255,255,0.15);
          color: #fff;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          border: 1.5px solid rgba(255,255,255,0.4);
          min-width: 180px;
          text-align: center;
          display: inline-block;
        }
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: clamp(16px, 5vw, 56px);
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.2);
        }
        .hero-stat-num {
          font-size: clamp(18px, 4vw, 28px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }
        .hero-stat-lbl {
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          margin-top: 4px;
        }
        .hero-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 24px;
        }
        .hero-dot {
          height: 6px;
          border-radius: 3px;
          background: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          padding: 0;
        }
        .hero-dot.active {
          width: 20px;
          background: #F0635A;
        }
        @media (max-width: 768px) {
          .hero-content { padding: 80px 20px 60px; }
          .hero-btn-primary, .hero-btn-secondary { 
            min-width: 140px; 
            padding: 13px 20px;
            font-size: 13px;
          }
        }
      `}</style>

      <section className="hero-section">
        <div className="hero-bg" />
        {heroImg && (
          <img src={heroImg} alt="Bridal Makeup" className="hero-img" />
        )}
        <div className="hero-overlay" />
        <div className="hero-accent" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-text">Sripuji Makeovers</span>
          </div>

          <h1 className="hero-h1">
            Rajahmundry&apos;s Most Trusted<br />
            <span>Bridal Makeup Artist</span>
          </h1>

          <p className="hero-sub">
            Because every bride deserves to feel breathtaking.
          </p>

          <div className="hero-btns">
            <Link href="/booking" className="hero-btn-primary">
              📅 Book a Consultation
            </Link>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener" className="hero-btn-secondary">
              💬 WhatsApp Us
            </a>
          </div>



          {gallery.length > 1 && (
            <div className="hero-dots">
              {gallery.map((_, i) => (
                <button key={i} onClick={() => setCurrentPhoto(i)}
                  className={`hero-dot${i===currentPhoto?' active':''}`}
                  style={{ width: i===currentPhoto ? '20px' : '6px' }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
