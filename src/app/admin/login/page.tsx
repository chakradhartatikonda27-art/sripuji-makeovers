'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res  = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Incorrect password. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--blush)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'var(--font-inter)' }}>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '48px 40px', maxWidth: '420px', width: '100%', boxShadow: '0 8px 40px rgba(240,99,90,0.12)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '44px', display: 'block', marginBottom: '12px' }}>💄</span>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.5px', marginBottom: '4px' }}>
            Sripuji <span style={{ color: 'var(--coral)' }}>Makeovers</span>
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--muted2)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Admin Dashboard</p>
          <div style={{ width: '32px', height: '2px', background: 'var(--coral)', borderRadius: '2px', margin: '12px auto 0' }} />
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '6px' }}>
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--ink)', padding: '12px 14px', borderRadius: '8px', fontFamily: 'var(--font-inter)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {error && (
            <div style={{ background: '#FCEAEA', border: '1px solid #F5C1C1', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: '#882020', fontWeight: 500 }}>
              ❌ {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '13px', background: loading ? 'var(--muted2)' : 'var(--coral)', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 18px rgba(240,99,90,0.28)' }}>
            {loading ? 'Signing in…' : 'Sign In to Dashboard'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: 'var(--muted2)' }}>
          Sripuji Makeovers · Admin Access Only
        </p>
      </div>
    </div>
  )
}
