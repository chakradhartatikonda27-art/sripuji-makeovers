'use client'
import { motion } from 'framer-motion'

export default function AboutSection() {
  return (
    <section id="about" style={{ background: '#fff', padding: '96px 6%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '72px', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>

        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: '18px -18px -18px 18px', background: 'var(--blush)', borderRadius: '24px', border: '1px solid var(--border)' }} />
          <div style={{ position: 'relative', zIndex: 1, aspectRatio: '3/4', borderRadius: '24px', background: 'linear-gradient(145deg,var(--blush2),var(--coral-l, #F5857E),#D94F47)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', overflow: 'hidden' }}>
            <span style={{ fontSize: '54px', opacity: 0.45, position: 'relative', zIndex: 1 }}>🌸</span>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', position: 'relative', zIndex: 1 }}>Artist at Work</span>
          </div>
          <div style={{ position: 'absolute', bottom: '16px', left: '-16px', zIndex: 2, background: '#fff', borderRadius: '12px', padding: '13px 16px', boxShadow: '0 8px 28px rgba(240,99,90,0.18)', display: 'flex', alignItems: 'center', gap: '11px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '22px' }}>🏆</span>
            <div>
              <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: 400, color: 'var(--coral)', display: 'block', lineHeight: 1, letterSpacing: '-1px' }}>500+</span>
              <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted2)' }}>Brides Transformed</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="eyebrow-dash">About Me</div>

          <span style={{ fontSize: 'clamp(22px,3.2vw,38px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)', display: 'block', lineHeight: 1.1, marginBottom: '3px' }}>
            Passion for Beauty,
          </span>
          <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(24px,3.5vw,42px)', fontWeight: 600, fontStyle: 'italic', color: 'var(--coral)', display: 'block', lineHeight: 1.1, marginBottom: '20px' }}>
            Perfection in Every Look
          </span>

          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '14px' }}>
            Hi, I&apos;m <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>Sri Pujitha</strong> — a freelance makeup artist based in <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>Rajahmundry</strong>. Since founding Sripuji Makeovers in 2023, I&apos;ve dedicated myself to creating personalised, stunning looks that celebrate every bride&apos;s unique beauty.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '24px' }}>
            My signature styles — <em style={{ color: 'var(--coral)', fontStyle: 'italic' }}>glamorous, minimalistic, and smokey-eyed</em> — are crafted exclusively with genuine premium international products. I travel to your venue so you can relax while I make you feel extraordinary.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', margin: '22px 0' }}>
            {[{n:'2023',l:'Est. Year'},{n:'11+',l:'Services'},{n:'100%',l:'Premium Kit'}].map(s => (
              <div key={s.l} style={{ background: 'var(--blush)', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px 16px' }}>
                <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 400, color: 'var(--coral)', display: 'block', lineHeight: 1, letterSpacing: '-1px', marginBottom: '6px' }}>{s.n}</span>
                <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--muted)' }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
            {[
              { label: 'Bridal Specialist',  hi: true },
              { label: 'Glamour Looks',      hi: true },
              { label: 'Smokey Eye',         hi: true },
              { label: 'Minimalistic Style', hi: false },
              { label: 'Groom Makeup',       hi: false },
              { label: 'Saree Draping',      hi: false },
              { label: 'Travels to Venue',   hi: false },
              { label: 'Paid Trial Available', hi: false },
            ].map(t => (
              <span key={t.label} style={{
                padding: '7px 16px', borderRadius: '50px',
                border: `1.5px solid ${t.hi ? 'var(--coral)' : 'var(--border2)'}`,
                fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
                color: t.hi ? 'var(--coral)' : 'var(--muted)',
                background: t.hi ? 'var(--blush)' : '#fff',
              }}>{t.label}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
