'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { Booking } from '@/types'

const MN = ['January','February','March','April','May','June','July','August','September','October','November','December']
const ALL_SLOTS = ['🌅 Morning (6AM–11AM)','☀️ Afternoon (11AM–3PM)','🌆 Evening (3PM–7PM)','🌙 Night (7PM–11PM)']

const STATUS_COLORS: Record<string,string> = { confirmed:'#EAF3DE', completed:'#D8F0E8', pending:'#FEF3D5', cancelled:'#FCEAEA' }
const STATUS_TEXT:   Record<string,string> = { confirmed:'#2E5A0D', completed:'#0C5E42', pending:'#7A4A00', cancelled:'#882020' }
const SLOT_COLORS:   Record<string,{bg:string;color:string;border:string}> = {
  '🌅 Morning (6AM–11AM)':   {bg:'#FFFBEB',color:'#92400E',border:'#FDE68A'},
  '☀️ Afternoon (11AM–3PM)': {bg:'#FFF7ED',color:'#C2410C',border:'#FED7AA'},
  '🌆 Evening (3PM–7PM)':    {bg:'#FFF5F3',color:'#9A3412',border:'#FFCDC9'},
  '🌙 Night (7PM–11PM)':     {bg:'#F5F3FF',color:'#6D28D9',border:'#DDD6FE'},
}

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab]           = useState<'calendar'|'bookings'|'analytics'>('calendar')
  const [all, setAll]           = useState<Booking[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [blocked, setBlocked]   = useState<string[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading]   = useState(true)
  const [calY, setCalY]         = useState(new Date().getFullYear())
  const [calM, setCalM]         = useState(new Date().getMonth())
  const [selDate, setSelDate]   = useState<string|null>(null)
  const [search, setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const load = useCallback(async () => {
    const [bkRes, blkRes, anlRes] = await Promise.all([
      fetch('/api/bookings').then(r=>r.json()),
      fetch('/api/blocked-dates').then(r=>r.json()),
      fetch('/api/admin/analytics').then(r=>r.json()),
    ])
    setAll(bkRes.data||[])
    setBookings(bkRes.data||[])
    setBlocked((blkRes||[]).map((d:any)=>d.blocked_date))
    setAnalytics(anlRes)
    setLoading(false)
  },[])

  useEffect(()=>{load()},[load])

  useEffect(()=>{
    let f=all
    if(search){const q=search.toLowerCase();f=f.filter(b=>b.name.toLowerCase().includes(q)||b.service.toLowerCase().includes(q)||b.booking_ref.toLowerCase().includes(q))}
    if(statusFilter!=='all')f=f.filter(b=>b.status===statusFilter)
    setBookings(f)
  },[search,statusFilter,all])

  async function logout(){await fetch('/api/admin/auth',{method:'DELETE'});router.push('/admin/login')}
  async function updateStatus(id:string,status:string){
    const res=await fetch(`/api/bookings/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})})
    if(res.ok){toast.success(`Updated to ${status}`);load()}else toast.error('Failed')
  }
  async function blockDate(date:string){
    const res=await fetch('/api/blocked-dates',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({date})})
    if(res.ok){toast.success(`${date} blocked`);load()}else toast.error('Already blocked')
  }
  async function unblockDate(date:string){
    await fetch('/api/blocked-dates',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({date})})
    toast.success(`${date} unblocked`);load()
  }
  function exportCsv(){
    let csv='Ref,Name,Phone,Service,Date,Time,Status\n'
    all.forEach(b=>csv+=`${b.booking_ref},"${b.name}",${b.phone},"${b.service}",${b.booking_date},${b.booking_time},${b.status}\n`)
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='bookings.csv';a.click()
    toast.success('Exported!')
  }
  function calNav(dir:number){let m=calM+dir,y=calY;if(m>11){m=0;y++}if(m<0){m=11;y--}setCalM(m);setCalY(y);setSelDate(null)}

  const today       = new Date();today.setHours(0,0,0,0)
  const firstDay    = new Date(calY,calM,1).getDay()
  const daysInMonth = new Date(calY,calM+1,0).getDate()

  function getDayBks(ds:string){return all.filter(b=>b.booking_date===ds&&b.status!=='cancelled')}
  function getDayStatus(ds:string){
    if(blocked.includes(ds))return 'blocked'
    const bks=getDayBks(ds)
    if(bks.length===0)return 'empty'
    if(bks.length>=ALL_SLOTS.length)return 'full'
    return 'partial'
  }

  const selBks      = selDate?getDayBks(selDate):[]
  const selBlocked  = selDate?blocked.includes(selDate):false
  const bookedTimes = new Set(selBks.map(b=>b.booking_time))

  const conf    = all.filter(b=>b.status==='confirmed').length
  const pend    = all.filter(b=>b.status==='pending').length
  const comp    = all.filter(b=>b.status==='completed').length
  const revenue = all.filter(b=>b.status==='completed').reduce((s,b)=>s+b.service_price,0)

  const tabStyle = (active:boolean) => ({
    padding:'12px 24px',fontSize:'11px',fontWeight:700 as const,
    letterSpacing:'0.5px',textTransform:'uppercase' as const,
    color:active?'var(--coral)':'var(--muted2)',
    background:'transparent',border:'none',
    borderBottom:`2.5px solid ${active?'var(--coral)':'transparent'}`,
    marginBottom:'-2px',cursor:'pointer',transition:'all 0.2s',
  })

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',fontFamily:'var(--font-inter)'}}>

      {/* Header */}
      <div style={{background:'#fff',borderBottom:'1px solid var(--border)',padding:'28px 5% 0'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'20px',flexWrap:'wrap',gap:'12px'}}>
            <div>
              <div className="eyebrow-dash">Admin</div>
              <h1 style={{fontSize:'clamp(24px,3.5vw,40px)',fontWeight:800,letterSpacing:'-1px',color:'var(--ink)'}}>
                Booking <span style={{color:'var(--coral)'}}>Dashboard</span>
              </h1>
            </div>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              <button onClick={()=>router.push('/admin/portfolio')} style={{padding:'8px 16px',borderRadius:'6px',border:'1.5px solid var(--border)',background:'#fff',fontSize:'11px',fontWeight:600,cursor:'pointer',color:'var(--muted)'}}>📸 Portfolio</button>
              <button onClick={()=>window.open('/','_blank')} style={{padding:'8px 16px',borderRadius:'6px',border:'1.5px solid var(--border)',background:'#fff',fontSize:'11px',fontWeight:600,cursor:'pointer',color:'var(--muted)'}}>🌐 Website</button>
              <button onClick={logout} style={{padding:'8px 16px',borderRadius:'6px',border:'1.5px solid var(--border)',background:'#fff',fontSize:'11px',fontWeight:600,cursor:'pointer',color:'var(--muted)'}}>🚪 Logout</button>
            </div>
          </div>
          {/* KPIs */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'10px',marginBottom:'20px'}}>
            {[{n:all.length,l:'Total',c:'var(--coral)'},{n:conf,l:'Confirmed',c:'#2E5A0D'},{n:pend,l:'Pending',c:'#7A4A00'},{n:comp,l:'Completed',c:'#0C5E42'},{n:`₹${(revenue/1000).toFixed(0)}K`,l:'Revenue',c:'var(--coral)'}].map(k=>(
              <div key={k.l} style={{background:'var(--blush)',border:'1px solid var(--border)',borderRadius:'10px',padding:'14px'}}>
                <span style={{fontSize:'26px',fontWeight:800,color:k.c,display:'block',letterSpacing:'-1px',lineHeight:1}}>{k.n}</span>
                <div style={{fontSize:'8px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted2)',marginTop:'4px'}}>{k.l}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',borderBottom:'2px solid var(--border)'}}>
            <button style={tabStyle(tab==='calendar')} onClick={()=>setTab('calendar')}>📅 Calendar</button>
            <button style={tabStyle(tab==='bookings')} onClick={()=>setTab('bookings')}>📋 All Bookings</button>
            <button style={tabStyle(tab==='analytics')} onClick={()=>setTab('analytics')}>📈 Analytics</button>
          </div>
        </div>
      </div>

      <div style={{padding:'28px 5%',maxWidth:'1400px',margin:'0 auto'}}>

        {/* ── CALENDAR TAB ── */}
        {tab==='calendar' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:'20px'}}>

            {/* Calendar */}
            <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden'}}>
              {/* Cal header */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 28px',borderBottom:'1px solid var(--border)',background:'var(--bg)'}}>
                <div>
                  <div style={{fontSize:'20px',fontWeight:800,color:'var(--ink)',letterSpacing:'-0.5px'}}>{MN[calM]} {calY}</div>
                  <div style={{fontSize:'11px',color:'var(--muted2)',marginTop:'3px'}}>Click any date to view bookings &amp; slots</div>
                </div>
                <div style={{display:'flex',gap:'8px'}}>
                  {['‹','›'].map((a,i)=>(
                    <button key={a} onClick={()=>calNav(i===0?-1:1)}
                      style={{width:36,height:36,border:'1.5px solid var(--border)',borderRadius:'8px',background:'#fff',color:'var(--muted)',fontSize:'18px',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s'}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--coral)';e.currentTarget.style.color='var(--coral)'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--muted)'}}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day labels */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'4px',padding:'16px 20px 8px'}}>
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
                  <div key={d} style={{textAlign:'center',fontSize:'10px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:'var(--muted2)',padding:'6px 0'}}>{d}</div>
                ))}
              </div>

              {/* Days */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'4px',padding:'0 20px 20px'}}>
                {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`}/>)}
                {Array.from({length:daysInMonth}).map((_,i)=>{
                  const d   = i+1
                  const ds  = `${calY}-${String(calM+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
                  const dt  = new Date(calY,calM,d)
                  const isPast   = dt<today
                  const isToday  = dt.toDateString()===today.toDateString()
                  const isSel    = ds===selDate
                  const status   = getDayStatus(ds)
                  const dayBks   = getDayBks(ds)

                  // Color scheme per status
                  const colors = {
                    full:    {bg:'#FCEAEA',border:'#F5C1C1',num:'#882020',badge:'🔴'},
                    partial: {bg:'#FEF9EC',border:'#FDE68A',num:'#92400E',badge:'🟡'},
                    blocked: {bg:'#F3F4F6',border:'#D1D5DB',num:'#6B7280',badge:'⚫'},
                    empty:   {bg:'#F0FDF4',border:'#BBF7D0',num:'#15803D',badge:'🟢'},
                  }
                  const c = isPast ? {bg:'transparent',border:'transparent',num:'var(--border2)',badge:''} : colors[status as keyof typeof colors] || colors.empty

                  return (
                    <div key={d} onClick={()=>!isPast&&setSelDate(ds)}
                      style={{
                        borderRadius:'10px',cursor:isPast?'default':'pointer',
                        padding:'8px 4px',textAlign:'center',
                        transition:'all 0.2s',minHeight:'72px',
                        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',gap:'4px',
                        background:isSel?'var(--coral)':c.bg,
                        border:`1.5px solid ${isSel?'var(--coral-d, #D94F47)':c.border}`,
                        opacity:isPast?0.35:1,
                        transform:isSel?'scale(1.06)':'scale(1)',
                        boxShadow:isSel?'0 4px 14px rgba(240,99,90,0.3)':'none',
                        outline:isToday&&!isSel?'2.5px solid var(--coral)':'none',
                        outlineOffset:'2px',
                      }}>
                      <span style={{fontSize:'14px',fontWeight:800,color:isSel?'#fff':c.num,lineHeight:1}}>{d}</span>
                      {!isPast && dayBks.length>0 && (
                        <div style={{background:isSel?'rgba(255,255,255,0.25)':'rgba(0,0,0,0.08)',borderRadius:'50px',padding:'2px 8px',fontSize:'10px',fontWeight:700,color:isSel?'#fff':c.num}}>
                          {dayBks.length} bk
                        </div>
                      )}
                      {!isPast && blocked.includes(ds) && (
                        <div style={{fontSize:'11px',fontWeight:700,color:isSel?'#fff':'#6B7280'}}>✕ Blocked</div>
                      )}
                      {!isPast && dayBks.length===0 && !blocked.includes(ds) && (
                        <div style={{fontSize:'9px',color:isSel?'rgba(255,255,255,0.7)':'#15803D',fontWeight:600}}>Free</div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div style={{display:'flex',gap:'16px',padding:'14px 20px',borderTop:'1px solid var(--border)',flexWrap:'wrap',background:'var(--bg)'}}>
                {[
                  {bg:'#FCEAEA',border:'#F5C1C1',label:'Fully Booked'},
                  {bg:'#FEF9EC',border:'#FDE68A',label:'Partially Booked'},
                  {bg:'#F0FDF4',border:'#BBF7D0',label:'Available'},
                  {bg:'#F3F4F6',border:'#D1D5DB',label:'Blocked'},
                ].map(l=>(
                  <div key={l.label} style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <div style={{width:14,height:14,borderRadius:'4px',background:l.bg,border:`1.5px solid ${l.border}`,flexShrink:0}}/>
                    <span style={{fontSize:'10px',color:'var(--muted2)',fontWeight:500}}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Panel */}
            <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden',display:'flex',flexDirection:'column',maxHeight:'700px'}}>
              {/* Panel header */}
              <div style={{padding:'18px',borderBottom:'1px solid var(--border)',background:'var(--bg)'}}>
                {selDate ? (
                  <>
                    <div style={{fontSize:'15px',fontWeight:800,color:'var(--ink)',marginBottom:'4px'}}>
                      {new Date(selDate+'T00:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
                    </div>
                    <div style={{fontSize:'12px',fontWeight:600,marginBottom:'10px',color:selBlocked?'#6B7280':selBks.length===0?'#15803D':selBks.length>=ALL_SLOTS.length?'#882020':'#92400E'}}>
                      {selBlocked?'⚫ Blocked — No bookings accepted':
                       selBks.length===0?'🟢 Fully Available — All 4 slots open':
                       selBks.length>=ALL_SLOTS.length?'🔴 Fully Booked — All slots taken':
                       `🟡 ${selBks.length} booked · ${ALL_SLOTS.length-selBks.length} slots still available`}
                    </div>
                    {selBlocked ? (
                      <button onClick={()=>unblockDate(selDate)}
                        style={{padding:'7px 16px',borderRadius:'6px',border:'1.5px solid var(--coral)',background:'var(--blush)',fontSize:'11px',fontWeight:700,cursor:'pointer',color:'var(--coral)'}}>
                        ✓ Unblock This Date
                      </button>
                    ) : (
                      <button onClick={()=>blockDate(selDate)}
                        style={{padding:'7px 16px',borderRadius:'6px',border:'1.5px solid #D1D5DB',background:'#F9FAFB',fontSize:'11px',fontWeight:600,cursor:'pointer',color:'#6B7280',transition:'all 0.2s'}}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor='#882020';e.currentTarget.style.color='#882020'}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor='#D1D5DB';e.currentTarget.style.color='#6B7280'}}>
                        🔒 Block Entire Day
                      </button>
                    )}
                  </>
                ) : (
                  <div style={{textAlign:'center',padding:'8px 0'}}>
                    <div style={{fontSize:'14px',fontWeight:700,color:'var(--muted2)'}}>Select a Date</div>
                    <div style={{fontSize:'11px',color:'var(--muted2)',marginTop:'3px'}}>Click any date to view slots</div>
                  </div>
                )}
              </div>

              {/* Slots */}
              <div style={{flex:1,overflowY:'auto',padding:'14px'}}>
                {!selDate ? (
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',padding:'32px',textAlign:'center',color:'var(--muted2)'}}>
                    <div style={{fontSize:'48px',marginBottom:'12px',opacity:0.4}}>📅</div>
                    <div style={{fontSize:'13px',fontWeight:600,color:'var(--ink)',marginBottom:'6px'}}>No date selected</div>
                    <div style={{fontSize:'11px',lineHeight:1.6}}>Click any date on the calendar to view its time slots and bookings</div>
                  </div>
                ) : selBlocked ? (
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px',textAlign:'center'}}>
                    <div style={{fontSize:'40px',marginBottom:'12px'}}>⚫</div>
                    <div style={{fontSize:'13px',fontWeight:700,color:'var(--ink)',marginBottom:'6px'}}>This Day is Blocked</div>
                    <div style={{fontSize:'11px',color:'var(--muted2)'}}>No bookings are accepted on this date. Click "Unblock" above to open it.</div>
                  </div>
                ) : (
                  ALL_SLOTS.map(slot=>{
                    const bk = selBks.find(b=>b.booking_time===slot)
                    const sc = SLOT_COLORS[slot]||{bg:'#fff',color:'var(--muted)',border:'var(--border)'}
                    if(bk){
                      return (
                        <div key={slot} style={{borderRadius:'12px',padding:'14px',marginBottom:'10px',background:sc.bg,border:`1.5px solid ${sc.border}`,transition:'all 0.2s'}}
                          onMouseEnter={e=>e.currentTarget.style.borderColor='var(--coral)'}
                          onMouseLeave={e=>e.currentTarget.style.borderColor=sc.border}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                            <div style={{fontSize:'11px',fontWeight:700,color:sc.color}}>{slot}</div>
                            <span style={{padding:'2px 8px',borderRadius:'3px',fontSize:'8px',fontWeight:700,textTransform:'uppercase',background:STATUS_COLORS[bk.status],color:STATUS_TEXT[bk.status]}}>{bk.status}</span>
                          </div>
                          <div style={{fontSize:'14px',fontWeight:700,color:'var(--ink)',marginBottom:'2px'}}>{bk.name}</div>
                          <div style={{fontSize:'12px',color:'var(--coral)',fontWeight:600,marginBottom:'2px'}}>{bk.service}</div>
                          <div style={{fontSize:'11px',color:'var(--muted2)'}}>{bk.phone}</div>
                          {bk.venue&&<div style={{fontSize:'10px',color:'var(--muted2)',marginTop:'2px'}}>📍 {bk.venue}</div>}
                          {bk.notes&&<div style={{fontSize:'10px',color:'var(--muted2)',marginTop:'2px',fontStyle:'italic'}}>💬 {bk.notes}</div>}
                          <div style={{display:'flex',gap:'6px',marginTop:'10px',flexWrap:'wrap'}}>
                            {bk.status!=='completed'&&(
                              <button onClick={()=>updateStatus(bk.id,'completed')}
                                style={{padding:'5px 12px',borderRadius:'6px',border:'1.5px solid #BBF7D0',background:'#F0FDF4',fontSize:'10px',fontWeight:700,cursor:'pointer',color:'#15803D',transition:'all 0.2s'}}>
                                ✓ Mark Done
                              </button>
                            )}
                            <a href={`https://wa.me/${bk.phone.replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener"
                              style={{padding:'5px 12px',borderRadius:'6px',background:'#25D366',fontSize:'10px',fontWeight:700,textDecoration:'none',color:'#fff',display:'inline-flex',alignItems:'center',gap:'4px'}}>
                              💬 WhatsApp
                            </a>
                            {bk.status!=='cancelled'&&(
                              <button onClick={()=>updateStatus(bk.id,'cancelled')}
                                style={{padding:'5px 12px',borderRadius:'6px',border:'1.5px solid #F5C1C1',background:'#FCEAEA',fontSize:'10px',fontWeight:700,cursor:'pointer',color:'#882020',transition:'all 0.2s'}}>
                                ✗ Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    } else {
                      return (
                        <div key={slot} style={{borderRadius:'12px',padding:'12px 14px',marginBottom:'8px',background:'#F8FFF5',border:'1.5px solid #BBF7D0',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'all 0.2s'}}
                          onMouseEnter={e=>e.currentTarget.style.borderColor='#2E5A0D'}
                          onMouseLeave={e=>e.currentTarget.style.borderColor='#BBF7D0'}>
                          <div>
                            <div style={{fontSize:'11px',fontWeight:700,color:'#6B7280',marginBottom:'2px'}}>{slot}</div>
                            <div style={{fontSize:'13px',fontWeight:600,color:'#15803D'}}>🟢 Available</div>
                          </div>
                          <button onClick={async()=>{
                            const res=await fetch('/api/bookings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'BLOCKED',phone:'0000000000',service:'Blocked Slot',service_price:0,booking_date:selDate,booking_time:slot,status:'cancelled',notes:'Admin blocked slot'})})
                            if(res.ok){toast.success(`${slot} blocked`);load()}else toast.error('Failed')
                          }}
                            style={{padding:'5px 12px',borderRadius:'6px',border:'1.5px solid #D1D5DB',background:'#F9FAFB',fontSize:'10px',fontWeight:600,cursor:'pointer',color:'#6B7280',transition:'all 0.2s'}}
                            onMouseEnter={e=>{e.currentTarget.style.borderColor='#882020';e.currentTarget.style.color='#882020';e.currentTarget.style.background='#FCEAEA'}}
                            onMouseLeave={e=>{e.currentTarget.style.borderColor='#D1D5DB';e.currentTarget.style.color='#6B7280';e.currentTarget.style.background='#F9FAFB'}}>
                            🔒 Block Slot
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
        {tab==='bookings' && (
          <>
            <div style={{display:'flex',gap:'12px',marginBottom:'16px',flexWrap:'wrap',alignItems:'center'}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search by name, service, ref…"
                style={{flex:1,maxWidth:'280px',padding:'10px 14px',border:'1.5px solid var(--border)',borderRadius:'8px',background:'#fff',fontFamily:'inherit',fontSize:'13px',outline:'none'}}/>
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
                style={{padding:'10px 14px',border:'1.5px solid var(--border)',borderRadius:'8px',background:'#fff',fontFamily:'inherit',fontSize:'13px',outline:'none',appearance:'none'}}>
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={exportCsv} style={{padding:'10px 20px',borderRadius:'8px',border:'1.5px solid var(--ink)',background:'transparent',fontSize:'11px',fontWeight:700,cursor:'pointer',textTransform:'uppercase',letterSpacing:'0.5px'}}>↓ Export CSV</button>
              <span style={{fontSize:'12px',color:'var(--muted2)',marginLeft:'auto'}}>{bookings.length} bookings</span>
            </div>
            <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden',overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
                <thead>
                  <tr>{['Ref','Client','Phone','Service','Date','Time Block','Price','Status','Actions'].map(h=>(
                    <th key={h} style={{padding:'11px 14px',fontSize:'9px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted2)',textAlign:'left',background:'var(--bg)',borderBottom:'1px solid var(--border)',whiteSpace:'nowrap'}}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {loading?(<tr><td colSpan={9} style={{padding:'40px',textAlign:'center',color:'var(--muted2)'}}>Loading…</td></tr>)
                  :bookings.length===0?(<tr><td colSpan={9} style={{padding:'40px',textAlign:'center',color:'var(--muted2)'}}>No bookings found</td></tr>)
                  :bookings.map(b=>(
                    <tr key={b.id}
                      onMouseEnter={e=>(e.currentTarget.style.background='var(--blush)')}
                      onMouseLeave={e=>(e.currentTarget.style.background='')}>
                      <td style={{padding:'11px 14px',borderBottom:'1px solid var(--border)'}}><code style={{fontSize:'11px',color:'var(--coral)',fontWeight:700}}>{b.booking_ref}</code></td>
                      <td style={{padding:'11px 14px',borderBottom:'1px solid var(--border)'}}><strong>{b.name}</strong>{b.email&&<span style={{display:'block',fontSize:'11px',color:'var(--muted2)'}}>{b.email}</span>}</td>
                      <td style={{padding:'11px 14px',borderBottom:'1px solid var(--border)',fontSize:'12px'}}>{b.phone}</td>
                      <td style={{padding:'11px 14px',borderBottom:'1px solid var(--border)',fontSize:'12px',maxWidth:'120px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.service}</td>
                      <td style={{padding:'11px 14px',borderBottom:'1px solid var(--border)',fontSize:'12px',whiteSpace:'nowrap'}}>{b.booking_date}</td>
                      <td style={{padding:'11px 14px',borderBottom:'1px solid var(--border)',fontSize:'11px',whiteSpace:'nowrap'}}>{b.booking_time}</td>
                      <td style={{padding:'11px 14px',borderBottom:'1px solid var(--border)',fontSize:'12px',fontWeight:600,color:'var(--coral)',whiteSpace:'nowrap'}}>₹{b.service_price?.toLocaleString('en-IN')}</td>
                      <td style={{padding:'11px 14px',borderBottom:'1px solid var(--border)'}}><span style={{padding:'3px 8px',borderRadius:'4px',fontSize:'9px',fontWeight:700,textTransform:'uppercase',background:STATUS_COLORS[b.status],color:STATUS_TEXT[b.status],whiteSpace:'nowrap'}}>{b.status}</span></td>
                      <td style={{padding:'11px 14px',borderBottom:'1px solid var(--border)',whiteSpace:'nowrap'}}>
                        {b.status!=='completed'&&(<button onClick={()=>updateStatus(b.id,'completed')} style={{padding:'4px 9px',fontSize:'10px',fontWeight:600,border:'1.5px solid var(--border)',borderRadius:'4px',background:'transparent',cursor:'pointer',marginRight:'4px',color:'var(--muted)',transition:'all 0.2s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='#2E5A0D';e.currentTarget.style.color='#2E5A0D'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--muted)'}}>✓ Done</button>)}
                        {b.status!=='cancelled'&&(<button onClick={()=>updateStatus(b.id,'cancelled')} style={{padding:'4px 9px',fontSize:'10px',fontWeight:600,border:'1.5px solid var(--border)',borderRadius:'4px',background:'transparent',cursor:'pointer',color:'var(--muted)',transition:'all 0.2s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='#882020';e.currentTarget.style.color='#882020'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--muted)'}}>✗ Cancel</button>)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── ANALYTICS TAB ── */}
        {tab==='analytics' && analytics && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
            <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
              <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--ink)',marginBottom:'16px'}}>Monthly Revenue (₹)</div>
              <div style={{display:'flex',alignItems:'flex-end',gap:'8px',height:'130px'}}>
                {(analytics.monthly||[]).map((m:any,i:number)=>{
                  const rev=m.revenue||0
                  const maxR=Math.max(...(analytics.monthly||[]).map((x:any)=>x.revenue||0),1)
                  return(
                    <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
                      <span style={{fontSize:'9px',color:'var(--muted2)',fontWeight:600}}>₹{(rev/1000).toFixed(0)}K</span>
                      <div style={{width:'100%',background:'var(--blush3)',borderRadius:'4px 4px 0 0',height:`${Math.round((rev/maxR)*110)}px`,minHeight:'4px',cursor:'pointer',transition:'.3s'}}
                        onMouseEnter={e=>(e.currentTarget.style.background='var(--coral)')}
                        onMouseLeave={e=>(e.currentTarget.style.background='var(--blush3)')}/>
                      <span style={{fontSize:'9px',color:'var(--muted2)',fontWeight:600}}>{new Date(m.month).toLocaleString('default',{month:'short'})}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
              <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--ink)',marginBottom:'16px'}}>Top Services</div>
              {(analytics.topServices||[]).map((s:any,i:number)=>(
                <div key={s.name} style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
                  <span style={{width:'20px',height:'20px',borderRadius:'50%',background:'var(--blush)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:'var(--coral)',flexShrink:0}}>{i+1}</span>
                  <span style={{fontSize:'12px',color:'var(--muted)',minWidth:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.name}</span>
                  <div style={{flex:1,height:'6px',background:'var(--blush2)',borderRadius:'3px',position:'relative'}}>
                    <div style={{position:'absolute',inset:'0 auto 0 0',background:'var(--coral)',borderRadius:'3px',width:`${Math.round((s.count/(analytics.topServices[0]?.count||1))*100)}%`}}/>
                  </div>
                  <span style={{fontSize:'11px',fontWeight:700,color:'var(--coral)',minWidth:'20px',textAlign:'right'}}>{s.count}</span>
                </div>
              ))}
              {!analytics.topServices?.length&&<p style={{fontSize:'13px',color:'var(--muted2)',textAlign:'center',padding:'20px 0'}}>No data yet</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
