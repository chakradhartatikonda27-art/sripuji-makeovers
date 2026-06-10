'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  async function login() {
    if (!password) { toast.error('Enter password'); return }
    setLoading(true)
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      toast.success('Welcome back!')
      router.push('/admin')
    } else {
      toast.error('Wrong password!')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-inter)', padding: '20px' }}>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '48px 40px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 60px rgba(240,99,90,0.1)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💄</div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          Sripuji <span style={{ color: 'var(--coral)' }}>Makeovers</span>
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--muted2)', marginBottom: '32px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>Admin Dashboard</p>

        <div style={{ marginBottom: '16px', textAlign: 'left' }}>
          <label style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '6px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Enter admin password"
            style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: 'var(--bg)', color: 'var(--ink)', transition: 'border-color 0.2s' }}
            onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        <button onClick={login} disabled={loading}
          style={{ width: '100%', padding: '13px', background: loading ? 'var(--muted2)' : 'var(--coral)', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 18px rgba(240,99,90,0.3)', transition: 'all 0.2s' }}>
          {loading ? 'Logging in…' : 'Login →'}
        </button>

        <p style={{ fontSize: '11px', color: 'var(--muted2)', marginTop: '20px' }}>
          Only authorized personnel can access this area.
        </p>
      </div>
    </div>
  )
}
