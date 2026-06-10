'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { Booking } from '@/types'

const MN = ['January','February','March','April','May','June','July','August','September','October','November','December']
const ALL_SLOTS = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM']

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#EAF3DE', completed: '#D8F0E8',
  pending:   '#FEF3D5', cancelled: '#FCEAEA',
}
const STATUS_TEXT: Record<string, string> = {
  confirmed: '#2E5A0D', completed: '#0C5E42',
  pending:   '#7A4A00', cancelled: '#882020',
}

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab]           = useState<'calendar' | 'bookings' | 'analytics'>('calendar')
  const [all, setAll]           = useState<Booking[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [blocked, setBlocked]   = useState<string[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading]   = useState(true)
  const [calY, setCalY]         = useState(new Date().getFullYear())
  const [calM, setCalM]         = useState(new Date().getMonth())
  const [selDate, setSelDate]   = useState<string | null>(null)
  const [search, setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const load = useCallback(async () => {
    const [bkRes, blkRes, anlRes] = await Promise.all([
      fetch('/api/bookings').then(r => r.json()),
      fetch('/api/blocked-dates').then(r => r.json()),
      fetch('/api/admin/analytics').then(r => r.json()),
    ])
    setAll(bkRes.data || [])
    setBookings(bkRes.data || [])
    setBlocked((blkRes || []).map((d: any) => d.blocked_date))
    setAnalytics(anlRes)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    let f = all
    if (search) { const q = search.toLowerCase(); f = f.filter(b => b.name.toLowerCase().includes(q) || b.service.toLowerCase().includes(q) || b.booking_ref.toLowerCase().includes(q)) }
    if (statusFilter !== 'all') f = f.filter(b => b.status === statusFilter)
    setBookings(f)
  }, [search, statusFilter, all])

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    if (res.ok) { toast.success(`Updated to ${status}`); load() }
    else toast.error('Update failed')
  }

  async function blockDate(date: string) {
    const res = await fetch('/api/blocked-dates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date }) })
    if (res.ok) { toast.success(`${date} blocked`); load() }
    else toast.error('Already blocked')
  }

  async function unblockDate(date: string) {
    await fetch('/api/blocked-dates', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date }) })
    toast.success(`${date} unblocked`); load()
  }

  async function blockSlot(date: string, time: string) {
    const res = await fetch('/api/bookings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'BLOCKED', phone: '0000000000', service: 'Blocked', service_price: 0, booking_date: date, booking_time: time, status: 'cancelled', notes: 'Admin blocked slot' }),
    })
    if (res.ok) { toast.success(`${time} blocked`); load() }
    else toast.error('Failed to block slot')
  }

  function exportCsv() {
    let csv = 'Ref,Name,Phone,Service,Date,Time,Status\n'
    all.forEach(b => csv += `${b.booking_ref},"${b.name}",${b.phone},"${b.service}",${b.booking_date},${b.booking_time},${b.status}\n`)
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'bookings.csv'; a.click()
    toast.success('Exported!')
  }

  function calNav(dir: number) {
    let m = calM + dir, y = calY
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setCalM(m); setCalY(y); setSelDate(null)
  }

  const today      = new Date(); today.setHours(0,0,0,0)
  const firstDay   = new Date(calY, calM, 1).getDay()
  const daysInMonth = new Date(calY, calM + 1, 0).getDate()

  function getDayStatus(ds: string) {
    if (blocked.includes(ds)) return 'blocked'
    const bks = all.filter(b => b.booking_date === ds && b.status !== 'cancelled')
    if (bks.length === 0) return 'available'
    if (bks.length >= ALL_SLOTS.length - 3) return 'full'
    return 'partial'
  }

  function getDayBookings(ds: string) {
    return all.filter(b => b.booking_date === ds && b.status !== 'cancelled')
              .sort((a, b) => ALL_SLOTS.indexOf(a.booking_time) - ALL_SLOTS.indexOf(b.booking_time))
  }

  const selBookings  = selDate ? getDayBookings(selDate) : []
  const selIsBlocked = selDate ? blocked.includes(selDate) : false
  const bookedTimes  = new Set(selBookings.map(b => b.booking_time))

  const conf    = all.filter(b => b.status === 'confirmed').length
  const pend    = all.filter(b => b.status === 'pending').length
  const comp    = all.filter(b => b.status === 'completed').length
  const revenue = all.filter(b => b.status === 'completed').reduce((s, b) => s + b.service_price, 0)

  const tabStyle = (active: boolean) => ({
    padding: '12px 22px', fontSize: '11px', fontWeight: 700 as const,
    letterSpacing: '0.5px', textTransform: 'uppercase' as const,
    color: active ? 'var(--coral)' : 'var(--muted2)',
    background: 'transparent', border: 'none',
    borderBottom: `2.5px solid ${active ? 'var(--coral)' : 'transparent'}`,
    marginBottom: '-2px', cursor: 'pointer', transition: 'all 0.2s',
  })

  const dayStatusColors: Record<string, { bg: string; color: string }> = {
    full:      { bg: '#FCEAEA', color: '#882020' },
    partial:   { bg: '#FEF3D5', color: '#7A4A00' },
    blocked:   { bg: '#F0F0F0', color: '#555555' },
    available: { bg: '#EAF3DE', color: '#2E5A0D' },
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)' }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '28px 6% 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div className="eyebrow-dash">Admin</div>
              <h1 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)' }}>
                Booking <span style={{ color: 'var(--coral)' }}>Dashboard</span>
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => router.push('/admin/portfolio')}
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1.5px solid var(--border)', background: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: 'var(--muted)' }}>
                📸 Portfolio
              </button>
              <button onClick={() => window.open('/', '_blank')}
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1.5px solid var(--border)', background: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: 'var(--muted)' }}>
                🌐 Website
              </button>
              <button onClick={logout}
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1.5px solid var(--border)', background: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: 'var(--muted)' }}>
                🚪 Logout
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', marginBottom: '20px' }}>
            {[
              { n: all.length, l: 'Total',     c: 'var(--coral)' },
              { n: conf,       l: 'Confirmed', c: '#2E5A0D' },
              { n: pend,       l: 'Pending',   c: '#7A4A00' },
              { n: comp,       l: 'Completed', c: '#0C5E42' },
              { n: `₹${(revenue/1000).toFixed(0)}K`, l: 'Revenue', c: 'var(--coral)' },
            ].map(k => (
              <div key={k.l} style={{ background: 'var(--blush)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: k.c, display: 'block', letterSpacing: '-1px', lineHeight: 1 }}>{k.n}</span>
                <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', marginTop: '4px' }}>{k.l}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '2px solid var(--border)' }}>
            <button style={tabStyle(tab === 'calendar')}  onClick={() => setTab('calendar')}>📅 Calendar</button>
            <button style={tabStyle(tab === 'bookings')}  onClick={() => setTab('bookings')}>📋 All Bookings</button>
            <button style={tabStyle(tab === 'analytics')} onClick={() => setTab('analytics')}>📈 Analytics</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 6%', maxWidth: '1400px', margin: '0 auto' }}>

        {/* ── CALENDAR TAB ── */}
        {tab === 'calendar' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>

            {/* Calendar */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.5px' }}>{MN[calM]} {calY}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted2)', marginTop: '2px' }}>Click any date to see time slots</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['‹','›'].map((a, i) => (
                    <button key={a} onClick={() => calNav(i === 0 ? -1 : 1)}
                      style={{ width: 32, height: 32, border: '1.5px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--muted)', fontSize: '16px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: '16px 20px' }}>
                {/* Day headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px', marginBottom: '6px' }}>
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted2)', padding: '5px 0' }}>{d}</div>
                  ))}
                </div>

                {/* Days grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px' }}>
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const d   = i + 1
                    const ds  = `${calY}-${String(calM+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
                    const dt  = new Date(calY, calM, d)
                    const isPast   = dt < today
                    const isToday  = dt.toDateString() === today.toDateString()
                    const isSel    = ds === selDate
                    const status   = getDayStatus(ds)
                    const dayBks   = getDayBookings(ds)
                    const sc       = dayStatusColors[status] || { bg: '#fff', color: 'var(--muted)' }

                    return (
                      <div key={d} onClick={() => !isPast && setSelDate(ds)}
                        style={{
                          borderRadius: '8px', cursor: isPast ? 'not-allowed' : 'pointer',
                          padding: '6px 4px', textAlign: 'center', transition: 'all 0.15s',
                          minHeight: '58px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '3px',
                          background: isPast ? 'transparent' : isSel ? 'var(--coral)' : sc.bg,
                          color: isPast ? 'var(--border2)' : isSel ? '#fff' : sc.color,
                          outline: isToday && !isSel ? '2.5px solid var(--coral)' : isSel ? '2.5px solid var(--ink)' : 'none',
                          outlineOffset: '1px',
                          opacity: isPast ? 0.4 : 1,
                          transform: isSel ? 'scale(1.05)' : 'scale(1)',
                        }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, lineHeight: 1 }}>{d}</span>
                        {!isPast && dayBks.length > 0 && (
                          <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {dayBks.slice(0, 3).map((_, bi) => (
                              <div key={bi} style={{ width: 5, height: 5, borderRadius: '50%', background: isSel ? 'rgba(255,255,255,0.7)' : '#2E5A0D' }} />
                            ))}
                          </div>
                        )}
                        {!isPast && dayBks.length > 0 && (
                          <span style={{ fontSize: '8px', fontWeight: 700, lineHeight: 1 }}>{dayBks.length} bk</span>
                        )}
                        {blocked.includes(ds) && !isPast && (
                          <span style={{ fontSize: '9px', fontWeight: 700 }}>✕</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '16px', padding: '12px 20px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                {[
                  { bg: '#FCEAEA', label: 'Fully Booked' },
                  { bg: '#FEF3D5', label: 'Partially Booked' },
                  { bg: '#EAF3DE', label: 'Available' },
                  { bg: '#F0F0F0', label: 'Blocked' },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '3px', background: l.bg, border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
                    <span style={{ fontSize: '10px', color: 'var(--muted2)' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Panel */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '680px' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                {selDate ? (
                  <>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>
                      {new Date(selDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                    <div style={{ fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>
                      {selIsBlocked ? '⚫ Blocked' :
                       selBookings.length === 0 ? '🟢 Fully Available' :
                       selBookings.length >= ALL_SLOTS.length - 3 ? '🔴 Fully Booked' :
                       `🟡 ${selBookings.length} booking${selBookings.length > 1 ? 's' : ''} · ${ALL_SLOTS.length - selBookings.length} slots free`}
                    </div>
                    {selIsBlocked ? (
                      <button onClick={() => unblockDate(selDate)}
                        style={{ marginTop: '8px', padding: '5px 12px', borderRadius: '6px', border: '1.5px solid var(--border)', background: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: 'var(--muted)', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
                        Unblock This Date
                      </button>
                    ) : (
                      <button onClick={() => blockDate(selDate)}
                        style={{ marginTop: '8px', padding: '5px 12px', borderRadius: '6px', border: '1.5px solid var(--border)', background: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: 'var(--muted)', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#882020'; e.currentTarget.style.color = '#882020' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
                        🔒 Block Entire Day
                      </button>
                    )}
                  </>
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--muted2)' }}>Select a Date</div>
                )}
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                {!selDate ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '32px', textAlign: 'center', color: 'var(--muted2)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.5 }}>📅</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>No date selected</div>
                    <div style={{ fontSize: '11px' }}>Click any date on the calendar to view time slots and bookings</div>
                  </div>
                ) : selIsBlocked ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚫</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>Date is Blocked</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted2)' }}>No bookings accepted on this date</div>
                  </div>
                ) : (
                  ALL_SLOTS.map(slot => {
                    const bk = selBookings.find(b => b.booking_time === slot)
                    if (bk) {
                      return (
                        <div key={slot} style={{ borderRadius: '10px', padding: '12px', marginBottom: '8px', background: 'var(--blush)', border: '1.5px solid var(--blush3)', transition: 'all 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--coral)')}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--blush3)')}>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted2)', marginBottom: '4px' }}>{slot}</div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>{bk.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--coral)', fontWeight: 600, marginTop: '2px' }}>{bk.service}</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted2)', marginTop: '1px' }}>{bk.phone}</div>
                          {bk.venue && <div style={{ fontSize: '10px', color: 'var(--muted2)', marginTop: '1px' }}>📍 {bk.venue}</div>}
                          <div style={{ marginTop: '6px' }}>
                            <span style={{ padding: '2px 8px', borderRadius: '3px', fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', background: STATUS_COLORS[bk.status], color: STATUS_TEXT[bk.status] }}>{bk.status}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '5px', marginTop: '8px', flexWrap: 'wrap' }}>
                            {bk.status !== 'completed' && (
                              <button onClick={() => updateStatus(bk.id, 'completed')}
                                style={{ padding: '4px 10px', borderRadius: '5px', border: '1.5px solid var(--border)', background: '#fff', fontSize: '10px', fontWeight: 600, cursor: 'pointer', color: 'var(--muted)', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2E5A0D'; e.currentTarget.style.color = '#2E5A0D' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
                                ✓ Done
                              </button>
                            )}
                            <a href={`https://wa.me/${bk.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener"
                              style={{ padding: '4px 10px', borderRadius: '5px', background: '#25D366', fontSize: '10px', fontWeight: 600, textDecoration: 'none', color: '#fff' }}>
                              💬 WhatsApp
                            </a>
                            {bk.status !== 'cancelled' && (
                              <button onClick={() => updateStatus(bk.id, 'cancelled')}
                                style={{ padding: '4px 10px', borderRadius: '5px', border: '1.5px solid var(--border)', background: '#fff', fontSize: '10px', fontWeight: 600, cursor: 'pointer', color: 'var(--muted)', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#882020'; e.currentTarget.style.color = '#882020' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
                                ✗ Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    } else {
                      return (
                        <div key={slot} style={{ borderRadius: '10px', padding: '10px 12px', marginBottom: '6px', background: '#F8FFF5', border: '1.5px solid #C0DD97', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted2)' }}>{slot}</div>
                            <div style={{ fontSize: '12px', color: '#2E5A0D', fontWeight: 500 }}>Available</div>
                          </div>
                          <button onClick={() => blockSlot(selDate!, slot)}
                            style={{ padding: '4px 10px', borderRadius: '5px', border: '1.5px solid #DDD', background: '#fff', fontSize: '10px', fontWeight: 600, cursor: 'pointer', color: '#888', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#882020'; e.currentTarget.style.color = '#882020' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#DDD'; e.currentTarget.style.color = '#888' }}>
                            🔒 Block
                          </button>
                        </div>
                      )
                    }
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === 'bookings' && (
          <>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name, service, ref…"
                style={{ flex: 1, maxWidth: '280px', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', background: '#fff', fontFamily: 'inherit', fontSize: '13px', outline: 'none' }} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', background: '#fff', fontFamily: 'inherit', fontSize: '13px', outline: 'none', appearance: 'none' }}>
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={exportCsv} style={{ padding: '10px 20px', borderRadius: '8px', border: '1.5px solid var(--ink)', background: 'transparent', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' }}>↓ Export CSV</button>
              <span style={{ fontSize: '12px', color: 'var(--muted2)', marginLeft: 'auto' }}>{bookings.length} bookings</span>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>{['Ref','Client','Phone','Service','Date','Time','Price','Status','Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', textAlign: 'left', background: 'var(--bg)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--muted2)' }}>Loading…</td></tr>
                  ) : bookings.length === 0 ? (
                    <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--muted2)' }}>No bookings found</td></tr>
                  ) : bookings.map(b => (
                    <tr key={b.id}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--blush)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)' }}>
                        <code style={{ fontSize: '11px', color: 'var(--coral)', fontWeight: 700 }}>{b.booking_ref}</code>
                      </td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)' }}>
                        <strong>{b.name}</strong>
                        {b.email && <span style={{ display: 'block', fontSize: '11px', color: 'var(--muted2)' }}>{b.email}</span>}
                      </td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', fontSize: '12px' }}>{b.phone}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', fontSize: '12px', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.service}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', fontSize: '12px', whiteSpace: 'nowrap' }}>{b.booking_date}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', fontSize: '12px', whiteSpace: 'nowrap' }}>{b.booking_time}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', fontSize: '12px', fontWeight: 600, color: 'var(--coral)', whiteSpace: 'nowrap' }}>₹{b.service_price?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', background: STATUS_COLORS[b.status], color: STATUS_TEXT[b.status], whiteSpace: 'nowrap' }}>{b.status}</span>
                      </td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                        {b.status !== 'completed' && (
                          <button onClick={() => updateStatus(b.id, 'completed')}
                            style={{ padding: '4px 9px', fontSize: '10px', fontWeight: 600, border: '1.5px solid var(--border)', borderRadius: '4px', background: 'transparent', cursor: 'pointer', marginRight: '4px', color: 'var(--muted)', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2E5A0D'; e.currentTarget.style.color = '#2E5A0D' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>✓ Done</button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button onClick={() => updateStatus(b.id, 'cancelled')}
                            style={{ padding: '4px 9px', fontSize: '10px', fontWeight: 600, border: '1.5px solid var(--border)', borderRadius: '4px', background: 'transparent', cursor: 'pointer', color: 'var(--muted)', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#882020'; e.currentTarget.style.color = '#882020' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>✗ Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── ANALYTICS TAB ── */}
        {tab === 'analytics' && analytics && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: '16px' }}>Monthly Revenue (₹)</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '130px' }}>
                {(analytics.monthly || []).map((m: any, i: number) => {
                  const rev = m.revenue || 0
                  const maxR = Math.max(...(analytics.monthly || []).map((x: any) => x.revenue || 0), 1)
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '9px', color: 'var(--muted2)', fontWeight: 600 }}>₹{(rev/1000).toFixed(0)}K</span>
                      <div style={{ width: '100%', background: 'var(--blush3)', borderRadius: '4px 4px 0 0', height: `${Math.round((rev/maxR)*110)}px`, minHeight: '4px', cursor: 'pointer', transition: '.3s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--coral)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--blush3)')} />
                      <span style={{ fontSize: '9px', color: 'var(--muted2)', fontWeight: 600 }}>{new Date(m.month).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: '16px' }}>Top Services</div>
              {(analytics.topServices || []).map((s: any, i: number) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--blush)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--coral)', flexShrink: 0 }}>{i+1}</span>
                  <span style={{ fontSize: '12px', color: 'var(--muted)', minWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                  <div style={{ flex: 1, height: '6px', background: 'var(--blush2)', borderRadius: '3px', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: '0 auto 0 0', background: 'var(--coral)', borderRadius: '3px', width: `${Math.round((s.count/(analytics.topServices[0]?.count||1))*100)}%` }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--coral)', minWidth: '20px', textAlign: 'right' }}>{s.count}</span>
                </div>
              ))}
              {!analytics.topServices?.length && <p style={{ fontSize: '13px', color: 'var(--muted2)', textAlign: 'center', padding: '20px 0' }}>No data yet</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
