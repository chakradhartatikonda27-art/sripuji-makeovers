'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AboutSection() {
  const [s, setS] = useState<Record<string, string>>({
    about_bio:       'Hi, I\'m Sri Pujitha — a freelance makeup artist based in Rajahmundry. Since founding Sripuji Makeovers in 2023, I\'ve dedicated myself to creating personalised, stunning looks that celebrate every bride\'s unique beauty. My signature styles — glamorous, minimalistic, and smokey-eyed — are crafted exclusively with genuine premium international products. I travel to your venue so you can relax while I make you feel extraordinary.',
    about_stat1:     '500+', about_stat1_lbl: 'Brides Transformed',
    about_stat2:     '2023', about_stat2_lbl: 'Est. Year',
    about_stat3:     '11+',  about_stat3_lbl: 'Services',
    about_stat4:     '100%', about_stat4_lbl: 'Premium Kit',
    about_tags:      'Bridal Specialist,Glamour Looks,Smokey Eye,Minimalistic Style,Groom Makeup,Saree Draping,Travels to Venue,Paid Trial Available',
    about_photo_url: '',
  })

  useEffect(() => {
    fetch('/api/site-settings').then(r => r.json())
      .then(data => { if (data && !data.error) setS(prev => ({ ...prev, ...data })) })
      .catch(() => {})
  }, [])

  const tags = (s.about_tags || '').split(',').filter(Boolean).map(t => t.trim())

  return (
    <section id="about" style={{ background: '#fff', padding: '80px 6%', borderBottom: '1px solid var(--border)' }}>
      <div className="about-section-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: '40px', alignItems: 'center' }}>

        {/* Photo */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '3/4', background: 'linear-gradient(155deg, var(--coral) 0%, var(--blush3) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {s.about_photo_url ? (
              <img src={s.about_photo_url} alt="Sri Pujitha" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', color: '#fff' }}>
                <div style={{ fontSize: '64px', marginBottom: '12px' }}>👩‍🎨</div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.8 }}>Artist at Work</div>
              </div>
            )}
          </div>
          {/* Floating badge — hidden on mobile via CSS */}
          <div className="about-float-badge" style={{ position: 'relative', top: '-24px', left: '-20px', background: '#fff', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🏆</span>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--coral)', letterSpacing: '-0.5px', lineHeight: 1 }}>{s.about_stat1}</div>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted2)', marginTop: '2px' }}>{s.about_stat1_lbl}</div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="eyebrow-dash">About Me</div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)', lineHeight: 1.1, marginBottom: '18px' }}>
            Passion for Beauty,<br />
            <span style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', color: 'var(--coral)', fontWeight: 600 }}>Perfection in Every Look</span>
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.85, marginBottom: '24px' }}>{s.about_bio}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '24px' }}>
            {[
              { n: s.about_stat2, l: s.about_stat2_lbl },
              { n: s.about_stat3, l: s.about_stat3_lbl },
              { n: s.about_stat4, l: s.about_stat4_lbl },
            ].map(k => (
              <div key={k.l} style={{ background: 'var(--blush)', border: '1px solid var(--blush3)', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--coral)', letterSpacing: '-0.5px', lineHeight: 1 }}>{k.n}</div>
                <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted2)', marginTop: '4px' }}>{k.l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.map(tag => (
              <span key={tag} style={{ padding: '6px 14px', background: '#fff', border: '1.5px solid var(--blush3)', borderRadius: '50px', fontSize: '11px', fontWeight: 600, color: 'var(--coral)' }}>{tag}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
