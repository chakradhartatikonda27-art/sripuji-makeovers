'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { Booking } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#EAF3DE', completed: '#D8F0E8',
  pending:   '#FEF3D5', cancelled: '#FCEAEA',
}
const STATUS_TEXT: Record<string, string> = {
  confirmed: '#2E5A0D', completed: '#0C5E42',
  pending:   '#7A4A00', cancelled: '#882020',
}

type Tab = 'overview' | 'bookings' | 'messages' | 'settings' | 'analytics'

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab]             = useState<Tab>('overview')
  const [bookings, setBookings]   = useState<Booking[]>([])
  const [all, setAll]             = useState<Booking[]>([])
  const [messages, setMessages]   = useState<any[]>([])
  const [blocked, setBlocked]     = useState<string[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  const load = useCallback(async () => {
    const [bkRes, blkRes, anlRes, msgRes] = await Promise.all([
      fetch('/api/bookings').then(r => r.json()),
      fetch('/api/blocked-dates').then(r => r.json()),
      fetch('/api/admin/analytics').then(r => r.json()),
      fetch('/api/admin/messages').then(r => r.json()).catch(() => []),
    ])
    setAll(bkRes.data || [])
    setBookings(bkRes.data || [])
    setBlocked((blkRes || []).map((d: any) => d.blocked_date))
    setAnalytics(anlRes)
    setMessages(msgRes || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    let filtered = all
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q) ||
        b.booking_ref.toLowerCase().includes(q) ||
        b.phone.includes(q)
      )
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter)
    }
    setBookings(filtered)
  }, [search, statusFilter, all])

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

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
    if (!date) { toast.error('Select a date'); return }
    const res = await fetch('/api/blocked-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    })
    if (res.ok) { toast.success(`${date} blocked`); input.value = ''; load() }
    else toast.error('Already blocked or error')
  }

  async function unblockDate(date: string) {
    await fetch('/api/blocked-dates', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    })
    toast.success(`${date} unblocked`)
    load()
  }

  function exportCsv() {
    let csv = 'Ref,Name,Phone,Email,Service,Date,Time,Status\n'
    all.forEach(b => csv += `${b.booking_ref},"${b.name}",${b.phone},${b.email || ''},"${b.service}",${b.booking_date},${b.booking_time},${b.status}\n`)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'sripuji-bookings.csv'; a.click()
    toast.success('Exported!')
  }

  const conf = all.filter(b => b.status === 'confirmed').length
  const pend = all.filter(b => b.status === 'pending').length
  const comp = all.filter(b => b.status === 'completed').length
  const canc = all.filter(b => b.status === 'cancelled').length
  const revenue = all.filter(b => b.status === 'completed').reduce((s, b) => s + b.service_price, 0)

  const sidebarItems: { id: Tab; icon: string; label: string }[] = [
    { id: 'overview',   icon: '📊', label: 'Overview'   },
    { id: 'bookings',   icon: '📅', label: 'Bookings'   },
    { id: 'messages',   icon: '📬', label: 'Messages'   },
    { id: 'analytics',  icon: '📈', label: 'Analytics'  },
    { id: 'settings',   icon: '⚙️', label: 'Settings'   },
  ]

  const inputStyle = { background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--ink)', padding: '10px 14px', borderRadius: '8px', fontFamily: 'inherit', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-inter)', background: 'var(--bg)' }}>

      {/* SIDEBAR */}
      <aside style={{ width: '240px', background: '#111', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
            Sripuji <span style={{ color: '#F5857E' }}>Makeovers</span>
          </div>
          <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: '3px' }}>
            Admin Dashboard
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '4px', transition: 'all 0.2s', background: tab === item.id ? 'rgba(240,99,90,0.15)' : 'transparent', color: tab === item.id ? '#F5857E' : 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: tab === item.id ? 600 : 400, textAlign: 'left' }}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
              {item.id === 'messages' && messages.length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--coral)', color: '#fff', borderRadius: '50px', padding: '2px 8px', fontSize: '10px', fontWeight: 700 }}>{messages.length}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <a href="/" target="_blank"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '12px', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
            🌐 View Website
          </a>
          <button onClick={logout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: '12px', transition: 'all 0.2s', textAlign: 'left' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(240,99,90,0.15)'; e.currentTarget.style.color = '#F5857E' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '32px', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.5px' }}>
              {sidebarItems.find(s => s.id === tab)?.icon} {sidebarItems.find(s => s.id === tab)?.label}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--muted2)', marginTop: '2px' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={load} style={{ padding: '8px 16px', borderRadius: '6px', border: '1.5px solid var(--border)', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--muted)' }}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* KPI CARDS — always visible */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px', marginBottom: '32px' }}>
          {[
            { n: all.length,                                    l: 'Total Bookings',  c: 'var(--coral)',  icon: '📋' },
            { n: conf,                                          l: 'Confirmed',       c: '#2E5A0D',       icon: '✅' },
            { n: pend,                                          l: 'Pending',         c: '#7A4A00',       icon: '⏳' },
            { n: comp,                                          l: 'Completed',       c: '#0C5E42',       icon: '🎉' },
            { n: `₹${(revenue/1000).toFixed(0)}K`,             l: 'Revenue',         c: 'var(--coral)',  icon: '💰' },
          ].map(k => (
            <div key={k.l} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 16px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(240,99,90,0.1)'; e.currentTarget.style.borderColor = 'var(--blush3)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{k.icon}</div>
              <span style={{ fontSize: '28px', fontWeight: 800, color: k.c, display: 'block', letterSpacing: '-1px', lineHeight: 1 }}>{k.n}</span>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', marginTop: '5px' }}>{k.l}</div>
            </div>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              {/* Recent Bookings */}
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>Recent Bookings</h3>
                  <button onClick={() => setTab('bookings')} style={{ fontSize: '11px', color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
                </div>
                {all.slice(0, 5).map(b => (
                  <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{b.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted2)' }}>{b.service} · {b.booking_date}</div>
                    </div>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', background: STATUS_COLORS[b.status], color: STATUS_TEXT[b.status] }}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Top Services */}
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>Top Services</h3>
                {(analytics?.topServices || []).map((s: any) => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--muted)', minWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                    <div style={{ flex: 1, height: '6px', background: 'var(--blush2)', borderRadius: '3px', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: '0 auto 0 0', background: 'var(--coral)', borderRadius: '3px', width: `${Math.round((s.count / (analytics?.topServices[0]?.count || 1)) * 100)}%` }} />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--coral)', minWidth: '22px', textAlign: 'right' }}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>Quick Actions</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: '📅 View All Bookings', action: () => setTab('bookings') },
                  { label: '📬 Check Messages',    action: () => setTab('messages') },
                  { label: '⚙️ Block a Date',      action: () => setTab('settings') },
                  { label: '📈 View Analytics',    action: () => setTab('analytics') },
                  { label: '↓ Export CSV',         action: exportCsv },
                  { label: '🌐 View Website',      action: () => window.open('/', '_blank') },
                ].map(a => (
                  <button key={a.label} onClick={a.action}
                    style={{ padding: '10px 18px', borderRadius: '8px', border: '1.5px solid var(--border)', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--ink)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--coral)'; e.currentTarget.style.color = 'var(--coral)'; e.currentTarget.style.background = 'var(--blush)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.background = '#fff' }}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name, service, ref, phone…"
                style={{ ...inputStyle, flex: 1, maxWidth: '320px' }} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ ...inputStyle, width: 'auto' }}>
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={exportCsv}
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1.5px solid var(--ink)', background: 'transparent', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ↓ Export CSV
              </button>
              <span style={{ fontSize: '12px', color: 'var(--muted2)', marginLeft: 'auto' }}>{bookings.length} bookings</span>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    {['Ref','Client','Phone','Service','Date','Time','Price','Status','Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', textAlign: 'left', background: 'var(--bg)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
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
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                        <code style={{ fontSize: '11px', color: 'var(--coral)', fontWeight: 700 }}>{b.booking_ref}</code>
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                        <strong style={{ display: 'block', fontSize: '13px' }}>{b.name}</strong>
                        {b.email && <span style={{ fontSize: '11px', color: 'var(--muted2)' }}>{b.email}</span>}
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: '12px' }}>{b.phone}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: '12px', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.service}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: '12px', whiteSpace: 'nowrap' }}>{b.booking_date}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: '12px', whiteSpace: 'nowrap' }}>{b.booking_time}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: '12px', fontWeight: 600, color: 'var(--coral)', whiteSpace: 'nowrap' }}>₹{b.service_price?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', background: STATUS_COLORS[b.status], color: STATUS_TEXT[b.status], whiteSpace: 'nowrap' }}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                        {b.status !== 'completed' && (
                          <button onClick={() => setStatus(b.id, 'completed')}
                            style={{ padding: '4px 10px', fontSize: '10px', fontWeight: 600, border: '1.5px solid var(--border)', borderRadius: '4px', background: 'transparent', cursor: 'pointer', marginRight: '4px', color: 'var(--muted)', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2E5A0D'; e.currentTarget.style.color = '#2E5A0D' }}
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
          </div>
        )}

        {/* ── MESSAGES TAB ── */}
        {tab === 'messages' && (
          <div>
            {messages.length === 0 ? (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: 'var(--muted2)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
                <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>No messages yet</div>
                <div style={{ fontSize: '13px' }}>Contact form submissions will appear here</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((m: any) => (
                  <div key={m.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>{m.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted2)', marginTop: '2px' }}>{m.phone} {m.email ? `· ${m.email}` : ''}</div>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted2)' }}>{new Date(m.created_at).toLocaleDateString('en-IN')}</div>
                    </div>
                    {m.service && <div style={{ fontSize: '12px', color: 'var(--coral)', fontWeight: 600, marginBottom: '8px' }}>Service: {m.service}</div>}
                    {m.message && <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7, background: 'var(--blush)', padding: '12px 14px', borderRadius: '8px' }}>{m.message}</p>}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <a href={`tel:${m.phone}`} style={{ padding: '7px 14px', borderRadius: '6px', border: '1.5px solid var(--border)', fontSize: '11px', fontWeight: 600, textDecoration: 'none', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>📞 Call</a>
                      <a href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener" style={{ padding: '7px 14px', borderRadius: '6px', background: '#25D366', fontSize: '11px', fontWeight: 600, textDecoration: 'none', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>WhatsApp</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {tab === 'analytics' && analytics && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Monthly Revenue (₹)</h3>
                <p style={{ fontSize: '11px', color: 'var(--muted2)', marginBottom: '20px' }}>From completed bookings</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '140px' }}>
                  {(analytics.monthly || []).map((m: any, i: number) => {
                    const rev  = m.revenue || 0
                    const maxR = Math.max(...(analytics.monthly || []).map((x: any) => x.revenue || 0), 1)
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '9px', color: 'var(--muted2)', fontWeight: 600 }}>₹{(rev / 1000).toFixed(0)}K</span>
                        <div style={{ width: '100%', background: 'var(--blush3)', borderRadius: '4px 4px 0 0', height: `${Math.round((rev / maxR) * 120)}px`, minHeight: '4px', transition: '0.3s', cursor: 'pointer' }}
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
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Booking Status</h3>
                <p style={{ fontSize: '11px', color: 'var(--muted2)', marginBottom: '20px' }}>Distribution across all bookings</p>
                {[
                  { label: 'Confirmed', count: conf, color: '#2E5A0D', bg: '#EAF3DE' },
                  { label: 'Completed', count: comp, color: '#0C5E42', bg: '#D8F0E8' },
                  { label: 'Pending',   count: pend, color: '#7A4A00', bg: '#FEF3D5' },
                  { label: 'Cancelled', count: canc, color: '#882020', bg: '#FCEAEA' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', background: s.bg, color: s.color, minWidth: '80px', textAlign: 'center' }}>{s.label}</span>
                    <div style={{ flex: 1, height: '8px', background: 'var(--blush2)', borderRadius: '4px', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: '0 auto 0 0', background: s.color, borderRadius: '4px', width: `${all.length > 0 ? Math.round((s.count / all.length) * 100) : 0}%`, transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: s.color, minWidth: '24px', textAlign: 'right' }}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Top Services by Bookings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(analytics.topServices || []).map((s: any, i: number) => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--blush)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--coral)', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', minWidth: '180px' }}>{s.name}</span>
                    <div style={{ flex: 1, height: '8px', background: 'var(--blush2)', borderRadius: '4px', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: '0 auto 0 0', background: 'var(--coral)', borderRadius: '4px', width: `${Math.round((s.count / (analytics.topServices[0]?.count || 1)) * 100)}%` }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--coral)', minWidth: '24px', textAlign: 'right' }}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Block dates */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>🗓️ Block Unavailable Dates</h3>
              <p style={{ fontSize: '12px', color: 'var(--muted2)', marginBottom: '20px' }}>Blocked dates will not be available for booking on the website.</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
                <input type="date" id="blkInp" style={{ ...inputStyle }} />
                <button onClick={blockDate}
                  style={{ padding: '10px 24px', borderRadius: '8px', border: '1.5px solid var(--coral)', background: 'var(--coral)', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  Block Date
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {blocked.length === 0
                  ? <span style={{ fontSize: '13px', color: 'var(--muted2)' }}>No dates blocked</span>
                  : blocked.map(d => (
                    <span key={d} style={{ padding: '5px 12px', background: 'var(--blush)', border: '1.5px solid var(--blush3)', borderRadius: '50px', fontSize: '12px', fontWeight: 600, color: 'var(--coral)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {d}
                      <button onClick={() => unblockDate(d)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--coral)', fontSize: '14px', lineHeight: 1, padding: 0 }}>✕</button>
                    </span>
                  ))
                }
              </div>
            </div>

            {/* Account info */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>👤 Account</h3>
              <p style={{ fontSize: '12px', color: 'var(--muted2)', marginBottom: '20px' }}>Admin account details.</p>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ background: 'var(--blush)', borderRadius: '10px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: '4px' }}>Business</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>Sripuji Makeovers</div>
                </div>
                <div style={{ background: 'var(--blush)', borderRadius: '10px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: '4px' }}>Phone</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>+91 88853 97517</div>
                </div>
                <div style={{ background: 'var(--blush)', borderRadius: '10px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: '4px' }}>Location</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>Rajahmundry, AP</div>
                </div>
              </div>
              <button onClick={logout}
                style={{ marginTop: '20px', padding: '10px 24px', borderRadius: '8px', border: '1.5px solid #882020', background: 'transparent', color: '#882020', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#882020'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#882020' }}>
                🚪 Logout
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
