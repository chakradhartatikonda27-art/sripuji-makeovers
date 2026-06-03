'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import type { Booking } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#EAF3DE',  completed: '#D8F0E8',
  pending:   '#FEF3D5',  cancelled: '#FCEAEA',
}
const STATUS_TEXT: Record<string, string> = {
  confirmed: '#2E5A0D',  completed: '#0C5E42',
  pending:   '#7A4A00',  cancelled: '#882020',
}

export default function AdminPage() {
  const [bookings, setBookings]   = useState<Booking[]>([])
  const [all, setAll]             = useState<Booking[]>([])
  const [blocked, setBlocked]     = useState<string[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [tab, setTab]             = useState<'bookings' | 'analytics'>('bookings')
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)

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
    if (!search) { setBookings(all); return }
    const q = search.toLowerCase()
    setBookings(all.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.service.toLowerCase().includes(q) ||
      b.booking_ref.toLowerCase().includes(q)
    ))
  }, [search, all])

  async function setStatus(id: string, status: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) { toast.success(`Updated to ${status}`); load() }
    else toast.error('Update failed')
  }

  async function blockDate() {
    const input = document.getElementById('blkInp') as HTMLInputElement
    const date  = input?.value
    if (!date) { toast.error('Select a date to block'); return }
    const res = await fetch('/api/blocked-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    })
    if (res.ok) { toast.success(`${date} blocked`); input.value = ''; load() }
    else toast.error('Already blocked or error')
  }

  async function unblockDate(date: string) {
    const res = await fetch('/api/blocked-dates', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    })
    if (res.ok) { toast.success(`${date} unblocked`); load() }
  }

  function exportCsv() {
    let csv = 'Ref,Name,Phone,Email,Service,Date,Time,Status\n'
    all.forEach(b => csv += `${b.booking_ref},"${b.name}",${b.phone},${b.email || ''},"${b.service}",${b.booking_date},${b.booking_time},${b.status}\n`)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'sripuji-bookings.csv'; a.click()
    toast.success('Exported successfully')
  }

  const btnStyle = { padding: '8px 20px', borderRadius: '6px', border: '1.5px solid var(--ink)', background: 'transparent', fontSize: '10px', fontWeight: 700 as const, cursor: 'pointer', textTransform: 'uppercase' as const, letterSpacing: '0.5px', transition: 'all 0.2s' }
  const tabStyle = (active: boolean) => ({ padding: '14px 28px', fontSize: '11px', fontWeight: 700 as const, letterSpacing: '0.5px', textTransform: 'uppercase' as const, color: active ? 'var(--coral)' : 'var(--muted2)', background: 'transparent', border: 'none', borderBottom: `2.5px solid ${active ? 'var(--coral)' : 'transparent'}`, marginBottom: '-2px', cursor: 'pointer', transition: 'all 0.2s' })

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px', minHeight: '100vh', background: 'var(--bg)' }}>
        <section style={{ background: '#fff', padding: '48px 6% 32px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="eyebrow-dash">Admin</div>
            <h1 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)' }}>
              Booking <span style={{ color: 'var(--coral)' }}>Dashboard</span>
            </h1>
          </div>
        </section>

        <div style={{ background: '#fff', borderBottom: '2px solid var(--border)', padding: '0 6%' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex' }}>
            <button style={tabStyle(tab === 'bookings')}  onClick={() => setTab('bookings')}>All Bookings</button>
            <button style={tabStyle(tab === 'analytics')} onClick={() => setTab('analytics')}>Analytics</button>
          </div>
        </div>

        <section style={{ padding: '40px 6%', maxWidth: '1300px', margin: '0 auto', width: '100%' }}>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '28px' }}>
            {[
              { n: all.length,                                        l: 'Total Bookings', c: 'var(--coral)' },
              { n: all.filter(b => b.status === 'confirmed').length,  l: 'Confirmed',      c: '#2E5A0D' },
              { n: all.filter(b => b.status === 'pending').length,    l: 'Pending',        c: '#7A4A00' },
              { n: all.filter(b => b.status === 'completed').length,  l: 'Completed',      c: '#0C5E42' },
            ].map(k => (
              <div key={k.l} style={{ background: 'var(--blush)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 16px' }}>
                <span style={{ fontSize: '32px', fontWeight: 800, color: k.c, display: 'block', letterSpacing: '-1px', lineHeight: 1 }}>{k.n}</span>
                <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', marginTop: '5px' }}>{k.l}</div>
              </div>
            ))}
          </div>

          {/* BOOKINGS TAB */}
          {tab === 'bookings' && (
            <>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={exportCsv} style={btnStyle}>↓ Export CSV</button>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, service, ref…"
                  style={{ flex: 1, maxWidth: '280px', marginLeft: 'auto', padding: '8px 16px', border: '1.5px solid var(--border)', borderRadius: '50px', background: 'var(--bg)', fontFamily: 'inherit', fontSize: '12px', outline: 'none' }} />
              </div>

              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr>
                      {['Ref','Client','Service','Date','Time','Status','Actions'].map(h => (
                        <th key={h} style={{ padding: '11px 14px', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', textAlign: 'left', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--muted2)' }}>Loading…</td></tr>
                    ) : bookings.length === 0 ? (
                      <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--muted2)' }}>No bookings found</td></tr>
                    ) : bookings.map(b => (
                      <tr key={b.id}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--blush)')}
                        onMouseLeave={e => (e.currentTarget.style.background = '')}>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                          <code style={{ fontSize: '11px', color: 'var(--coral)', fontWeight: 700 }}>{b.booking_ref}</code>
                        </td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                          <strong style={{ display: 'block' }}>{b.name}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--muted2)' }}>{b.phone}</span>
                        </td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: '12px' }}>{b.service}</td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: '12px' }}>{b.booking_date}</td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: '12px' }}>{b.booking_time}</td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                          <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', background: STATUS_COLORS[b.status] || '#eee', color: STATUS_TEXT[b.status] || '#333' }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                          {b.status !== 'completed' && (
                            <button onClick={() => setStatus(b.id, 'completed')}
                              style={{ padding: '4px 10px', fontSize: '10px', fontWeight: 600, border: '1.5px solid var(--border)', borderRadius: '4px', background: 'transparent', cursor: 'pointer', marginRight: '4px', color: 'var(--muted)', transition: 'all 0.2s' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)' }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
                              ✓ Done
                            </button>
                          )}
                          {b.status !== 'cancelled' && (
                            <button onClick={() => setStatus(b.id, 'cancelled')}
                              style={{ padding: '4px 10px', fontSize: '10px', fontWeight: 600, border: '1.5px solid var(--border)', borderRadius: '4px', background: 'transparent', cursor: 'pointer', color: 'var(--muted)', transition: 'all 0.2s' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = '#882020'; e.currentTarget.style.color = '#882020' }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
                              ✗ Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Block Dates */}
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginTop: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: '14px' }}>
                  Block Unavailable Dates
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input type="date" id="blkInp"
                    style={{ padding: '8px 12px', border: '1.5px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', fontFamily: 'inherit', fontSize: '13px', outline: 'none' }} />
                  <button onClick={blockDate} style={btnStyle}>Block Date</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  {blocked.length === 0
                    ? <span style={{ fontSize: '12px', color: 'var(--muted2)' }}>No dates blocked</span>
                    : blocked.map(d => (
                      <span key={d} style={{ padding: '4px 12px', background: 'var(--blush)', border: '1.5px solid var(--blush3)', borderRadius: '50px', fontSize: '11px', fontWeight: 600, color: 'var(--coral)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {d}
                        <button onClick={() => unblockDate(d)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--coral)', fontSize: '14px', lineHeight: 1, padding: 0 }}>✕</button>
                      </span>
                    ))
                  }
                </div>
              </div>
            </>
          )}

          {/* ANALYTICS TAB */}
          {tab === 'analytics' && analytics && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: '4px' }}>Revenue (₹) — Last 6 Months</div>
                <div style={{ fontSize: '12px', color: 'var(--muted2)', marginBottom: '16px' }}>From completed bookings</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
                  {(analytics.monthly || []).map((m: any, i: number) => {
                    const rev  = m.revenue || 0
                    const maxR = Math.max(...(analytics.monthly || []).map((x: any) => x.revenue || 0), 1)
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '9px', color: 'var(--muted2)', fontWeight: 600 }}>₹{(rev / 1000).toFixed(0)}K</span>
                        <div style={{ width: '100%', background: 'var(--blush3)', borderRadius: '4px 4px 0 0', height: `${Math.round((rev / maxR) * 100)}px`, minHeight: '4px', transition: '0.3s', cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--coral)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'var(--blush3)')} />
                        <span style={{ fontSize: '9px', color: 'var(--muted2)', fontWeight: 600 }}>
                          {new Date(m.month).toLocaleString('default', { month: 'short' })}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: '4px' }}>Top Services</div>
                <div style={{ fontSize: '12px', color: 'var(--muted2)', marginBottom: '16px' }}>By booking count</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(analytics.topServices || []).map((s: any) => (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--muted)', minWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                      <div style={{ flex: 1, height: '6px', background: 'var(--blush2)', borderRadius: '3px', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: '0 auto 0 0', background: 'var(--coral)', borderRadius: '3px', width: `${Math.round((s.count / (analytics.topServices[0]?.count || 1)) * 100)}%` }} />
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--coral)', minWidth: '22px', textAlign: 'right' }}>{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  )
}
