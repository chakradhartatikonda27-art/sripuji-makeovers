'use client'
import { useMobile } from '@/context/MobileContext'

export default function StatsSection() {
  const { isMobile } = useMobile()
  return (
    <section style={{ background:'#fff', borderBottom:'1px solid var(--border)', padding: isMobile ? '24px 5%' : '32px 6%' }}>
      <div style={{ maxWidth:'900px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px' }}>
        {[{ n:'500+', l:'Brides Transformed' }, { n:'11+', l:'Services' }, { n:'5.0⭐', l:'Rating' }, { n:'3+', l:'Years' }].map(k => (
          <div key={k.l} style={{ textAlign:'center', padding: isMobile ? '16px 8px' : '20px 8px', background:'var(--blush)', borderRadius:'12px', border:'1px solid var(--blush3)' }}>
            <div style={{ fontSize: isMobile ? '20px' : '28px', fontWeight:800, color:'var(--coral)', letterSpacing:'-0.5px', lineHeight:1 }}>{k.n}</div>
            <div style={{ fontSize:'9px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', color:'var(--muted2)', marginTop:'6px', lineHeight:1.3 }}>{k.l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
