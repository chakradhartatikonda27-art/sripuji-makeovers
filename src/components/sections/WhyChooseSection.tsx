'use client'
import { motion } from 'framer-motion'

export default function WhyChooseSection() {
  const reasons = [
    { icon:'🎨', title:'A Vision for Every Face', desc:'Every look is crafted to honour your features and personality — never templated, always tailored.' },
    { icon:'💄', title:'Only Premium Products', desc:'From NARS to Huda Beauty and MAC — your skin touches nothing but 100% genuine international brands.' },
    { icon:'📸', title:'Camera-Ready Perfection', desc:'Every finish is designed to look flawless from the mandap to the last candid photograph.' },
    { icon:'🕊️', title:'Calm & On Time', desc:'Sri Pujitha brings a composed, unhurried presence to your event morning — so you can simply enjoy it.' },
    { icon:'⭐', title:'500+ Brides Transformed', desc:'Hundreds of brides across Rajahmundry & East Godavari have trusted us with their most important look.' },
    { icon:'✨', title:'Your Style, Elevated', desc:'We listen, we understand, and we create — always you, just your most beautiful self.' },
  ]
  return (
    <>
      <style>{`
        .why-section {
          background: #fff;
          padding: 64px 5%;
          border-bottom: 1px solid var(--border);
        }
        .why-inner { max-width: 1200px; margin: 0 auto; }
        .why-header { text-align: center; margin-bottom: 48px; }
        .why-eyebrow {
          display: inline-flex; align-items: center; gap: 8px; margin-bottom: 12px;
        }
        .why-eyebrow-line { width: 24px; height: 2px; background: var(--coral); }
        .why-eyebrow-text {
          font-size: 9px; font-weight: 700; letter-spacing: 3px;
          text-transform: uppercase; color: var(--coral);
        }
        .why-h2 {
          font-size: clamp(24px, 4vw, 38px);
          font-weight: 800; letter-spacing: -1px;
          color: var(--ink); margin-bottom: 12px; line-height: 1.2;
        }
        .why-h2 span { color: var(--coral); }
        .why-sub { font-size: 15px; color: var(--muted2); max-width: 500px; margin: 0 auto; }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .why-card {
          padding: 28px;
          background: var(--blush);
          border-radius: 16px;
          border: 1px solid var(--blush3);
        }
        .why-icon { font-size: 36px; margin-bottom: 14px; }
        .why-title { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
        .why-desc { font-size: 13px; color: var(--muted2); line-height: 1.7; }
        @media (max-width: 768px) {
          .why-section { padding: 48px 5%; }
          .why-grid { grid-template-columns: 1fr; gap: 14px; }
          .why-card { padding: 20px; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .why-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
      <section className="why-section">
        <div className="why-inner">
          <div className="why-header">
            <div className="why-eyebrow">
              <div className="why-eyebrow-line" />
              <span className="why-eyebrow-text">Why Choose Us</span>
              <div className="why-eyebrow-line" />
            </div>
            <h2 className="why-h2">
              Because You Deserve More Than<br />
              <span>Great Makeup</span>
            </h2>
            <p className="why-sub">You deserve an experience — from first consultation to your final look.</p>
          </div>
          <div className="why-grid">
            {reasons.map((r, i) => (
              <motion.div key={i} className="why-card"
                initial={{ opacity:0, y:20 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay:i*0.1 }}>
                <div className="why-icon">{r.icon}</div>
                <div className="why-title">{r.title}</div>
                <div className="why-desc">{r.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
