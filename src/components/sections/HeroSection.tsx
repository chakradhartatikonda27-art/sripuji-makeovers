'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const [gallery, setGallery] = useState<string[]>([])
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [whatsapp, setWhatsapp] = useState('918885397517')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fetch('/api/site-settings').then(r => r.json())
      .then(d => { if (d?.contact_whatsapp) setWhatsapp(d.contact_whatsapp) })
      .catch(() => {})
    fetch('/api/hero-gallery').then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) setGallery(d) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (gallery.length <= 1) return
    const t = setInterval(() => setCurrentPhoto(p => (p + 1) % gallery.length), 5000)
    return () => clearInterval(t)
  }, [gallery])

  const heroImg = gallery[currentPhoto] || ''

  return (
    <>
      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
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
          transition: opacity 1s ease;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.2) 0%,
            rgba(0,0,0,0.5) 50%,
            rgba(0,0,0,0.75) 100%
          );
          z-index: 1;
        }
        .hero-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--coral);
          z-index: 3;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          width: 100%;
          max-width: 900px;
          padding: 100px 24px 80px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(240,99,90,0.2);
          border: 1px solid rgba(240,99,90,0.5);
          border-radius: 50px;
          padding: 6px 20px;
          margin-bottom: 20px;
        }
        .hero-badge span {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--coral);
        }
        .hero-h1 {
          font-size: clamp(28px, 6vw, 68px);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin-bottom: 16px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }
        .hero-h1 span { color: var(--coral); }
        .hero-sub {
          font-size: clamp(14px, 2vw, 18px);
          color: rgba(255,255,255,0.85);
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
          background: var(--coral);
          color: #fff;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 8px 32px rgba(240,99,90,0.45);
          min-width: 200px;
          text-align: center;
          display: inline-block;
        }
        .hero-btn-secondary {
          padding: 15px 36px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          color: #fff;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          border: 1.5px solid rgba(255,255,255,0.35);
          min-width: 200px;
          text-align: center;
          display: inline-block;
        }
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: clamp(16px, 5vw, 56px);
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.15);
        }
        .hero-stat-num {
          font-size: clamp(18px, 4vw, 28px);
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }
        .hero-stat-lbl {
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
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
        }
        .hero-dot.active {
          width: 20px !important;
          background: var(--coral) !important;
        }
        .hero-scroll {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .hero-scroll span {
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .hero-scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
        }
        @media (max-width: 768px) {
          .hero-content { padding: 110px 20px 90px; }
          .hero-btn-primary, .hero-btn-secondary { min-width: 160px; padding: 13px 24px; }
          .hero-scroll { display: none; }
        }
      `}</style>

      <section className="hero-section">
        {heroImg ? (
          <img src={heroImg} alt="Bridal Makeup" className="hero-img" />
        ) : (
          <div className="hero-bg" />
        )}
        <div className="hero-overlay" />
        <div className="hero-accent" />

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div className="hero-badge" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
            <span>Sripuji Makeovers · Rajahmundry</span>
          </motion.div>

          <motion.h1 className="hero-h1" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
            Rajahmundry&apos;s Most Trusted<br />
            <span>Bridal Makeup Artist</span>
          </motion.h1>

          <motion.p className="hero-sub" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}>
            Because every bride deserves to feel breathtaking.
          </motion.p>

          <motion.div className="hero-btns" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}>
            <Link href="/booking" className="hero-btn-primary">
              📅 Book a Consultation
            </Link>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener" className="hero-btn-secondary">
              💬 WhatsApp Us
            </a>
          </motion.div>

          <motion.div className="hero-stats" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8 }}>
            {[{ n:'500+', l:'Brides' }, { n:'11+', l:'Services' }, { n:'5.0⭐', l:'Rating' }, { n:'3+', l:'Years' }].map(k => (
              <div key={k.l} style={{ textAlign:'center' }}>
                <div className="hero-stat-num">{k.n}</div>
                <div className="hero-stat-lbl">{k.l}</div>
              </div>
            ))}
          </motion.div>

          {isMounted && gallery.length > 1 && (
            <div className="hero-dots">
              {gallery.map((_, i) => (
                <div key={i} onClick={() => setCurrentPhoto(i)}
                  className={`hero-dot${i===currentPhoto?' active':''}`}
                  style={{ width: i===currentPhoto ? '20px' : '6px' }}
                />
              ))}
            </div>
          )}
        </motion.div>

        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </section>
    </>
  )
}
