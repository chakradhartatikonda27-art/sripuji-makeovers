export default function TickerSection() {
  const items = ['Bridal Makeup','Reception Makeup','Engagement Makeup','Groom Makeup','Maternity Photoshoot','Half Saree Function','Saree Draping','Hair Styling','Airbrush Makeup','Saree Pre-Pleating']
  return (
    <div style={{ background: 'var(--coral)', padding: '11px 0', overflow: 'hidden' }}>
      <div className="ticker-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ padding: '0 28px', fontSize: '9px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '28px' }}>
            {item}
            <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
