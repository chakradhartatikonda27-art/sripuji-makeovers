'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'

const CATS = ['Bridal','Engagement','Reception','Function','Half Saree','Groom','Photoshoot']

interface PortfolioItem {
  id: string
  label: string
  category: string
  image_url: string
  is_tall: boolean
  sort_order: number
  created_at: string
}

export default function AdminPortfolio() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [items, setItems]         = useState<PortfolioItem[]>([])
  const [loading, setLoading]     = useState(true)
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter]       = useState('All')
  const [form, setForm]           = useState({ label: '', category: 'Bridal' })
  const [preview, setPreview]     = useState<string | null>(null)
  const [file, setFile]           = useState<File | null>(null)

  async function load() {
    const res = await fetch('/api/portfolio')
    const data = await res.json()
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function upload() {
    if (!file) { toast.error('Please select a photo'); return }
    if (!form.label) { toast.error('Please enter a label'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const upRes  = await fetch('/api/portfolio/upload', { method: 'POST', body: fd })
      const upData = await upRes.json()
      if (!upRes.ok) throw new Error(upData.error)

      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, image_url: upData.url, sort_order: items.length }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast.success('Photo uploaded successfully!')
      setForm({ label: '', category: 'Bridal' })
      setFile(null)
      setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
      load()
    } catch (e: any) {
      toast.error(e.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function deleteItem(item: PortfolioItem) {
    if (!confirm(`Delete "${item.label}"?`)) return
    const res = await fetch('/api/portfolio', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, image_url: item.image_url }),
    })
    if (res.ok) { toast.success('Deleted!'); load() }
    else toast.error('Delete failed')
  }

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter)

  const inputStyle = {
    width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)',
    color: 'var(--ink)', padding: '10px 14px', borderRadius: '8px',
    fontFamily: 'inherit', fontSize: '13px', outline: 'none',
    appearance: 'none' as const, WebkitAppearance: 'none' as const,
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px', minHeight: '100vh', background: 'var(--bg)' }}>
        <section style={{ background: '#fff', padding: '40px 6% 28px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div className="eyebrow-dash">Admin</div>
              <h1 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--ink)' }}>
                Portfolio <span style={{ color: 'var(--coral)' }}>Manager</span>
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--muted2)', marginTop: '4px' }}>
                Upload and manage portfolio photos · {items.length} photos
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => router.push('/admin')}
                style={{ padding: '9px 20px', borderRadius: '6px', border: '1.5px solid var(--border)', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--muted)' }}>
                ← Back to Dashboard
              </button>
              <button onClick={() => router.push('/portfolio')}
                style={{ padding: '9px 20px', borderRadius: '6px', border: '1.5px solid var(--border)', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--muted)' }}>
                🌐 View Portfolio
              </button>
            </div>
          </div>
        </section>

        <section style={{ padding: '32px 6%' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>

            {/* Upload Panel */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', position: 'sticky', top: '88px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
                📸 Upload New Photo
              </h2>

              {/* Drop zone */}
              <div onClick={() => fileRef.current?.click()}
                style={{ border: `2px dashed ${preview ? 'var(--coral)' : 'var(--border2)'}`, borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px', transition: 'all 0.2s', background: preview ? 'var(--blush)' : '#fff', overflow: 'hidden' }}
                onMouseEnter={e => { if (!preview) e.currentTarget.style.borderColor = 'var(--coral)' }}
                onMouseLeave={e => { if (!preview) e.currentTarget.style.borderColor = 'var(--border2)' }}>
                {preview ? (
                  <img src={preview} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                ) : (
                  <div>
                    <div style={{ fontSize: '36px', marginBottom: '8px' }}>📷</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Click to upload photo</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted2)' }}>JPG, PNG, WEBP — max 10MB</div>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />

              {preview && (
                <button onClick={() => { setPreview(null); setFile(null); if (fileRef.current) fileRef.current.value = '' }}
                  style={{ width: '100%', padding: '8px', marginBottom: '14px', borderRadius: '6px', border: '1.5px solid var(--border2)', background: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: 'var(--muted)' }}>
                  ✕ Remove photo
                </button>
              )}

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '5px' }}>Label *</label>
                <input style={inputStyle} placeholder="e.g. Traditional Bridal Look" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
                  onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '5px' }}>Category *</label>
                <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  onFocus={e => (e.target.style.borderColor = 'var(--coral)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', padding: '12px 14px', background: 'var(--blush)', borderRadius: '8px', cursor: 'pointer' }}
                onClick={() => setForm({ ...form, is_tall: !form.is_tall })}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${form.is_tall ? 'var(--coral)' : 'var(--border2)'}`, background: form.is_tall ? 'var(--coral)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                  {form.is_tall && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>✓</span>}
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Tall card</div>
                  <div style={{ fontSize: '10px', color: 'var(--muted2)' }}>Makes this photo twice as tall in grid</div>
                </div>
              </div>

              <button onClick={upload} disabled={uploading || !file}
                style={{ width: '100%', padding: '13px', background: uploading || !file ? 'var(--muted2)' : 'var(--coral)', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: uploading || !file ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(240,99,90,0.28)' }}>
                {uploading ? '⏳ Uploading…' : '📤 Upload Photo'}
              </button>
            </div>

            {/* Photos Grid */}
            <div>
              {/* Filter tabs */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {['All', ...CATS].map(cat => (
                  <button key={cat} onClick={() => setFilter(cat)}
                    style={{ padding: '7px 18px', borderRadius: '50px', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', border: `1.5px solid ${filter === cat ? 'var(--coral)' : 'var(--border2)'}`, color: filter === cat ? 'var(--coral)' : 'var(--muted2)', background: filter === cat ? 'var(--blush)' : '#fff' }}>
                    {cat}
                  </button>
                ))}
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--muted2)', alignSelf: 'center' }}>{filtered.length} photos</span>
              </div>

              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{ aspectRatio: '1', background: 'var(--blush)', borderRadius: '12px' }} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>No photos yet</div>
                  <div style={{ fontSize: '13px', color: 'var(--muted2)' }}>Upload your first photo using the panel on the left</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
                  {filtered.map(item => (
                    <div key={item.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(240,99,90,0.12)'; e.currentTarget.style.borderColor = 'var(--blush3)' }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                        <img src={item.image_url} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                        {item.is_tall && (
                          <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>TALL</div>
                        )}
                        <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--coral)', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>{item.category}</div>
                      </div>
                      <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>{item.label}</div>
                          <div style={{ fontSize: '10px', color: 'var(--muted2)', marginTop: '2px' }}>{new Date(item.created_at).toLocaleDateString('en-IN')}</div>
                        </div>
                        <button onClick={() => deleteItem(item)}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: '1.5px solid var(--border)', background: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: 'var(--muted)', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#882020'; e.currentTarget.style.color = '#882020' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
