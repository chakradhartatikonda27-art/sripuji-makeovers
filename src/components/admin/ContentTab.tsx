'use client'

import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'

interface Testimonial {
  id: string
  author: string
  event: string
  text: string
  rating: number
  is_active: boolean
}

export default function ContentTab() {
  const [settings, setSettings]   = useState<Record<string, string>>({})
  const [tests, setTests]         = useState<Testimonial[]>([])
  const [section, setSection]     = useState<'about'|'services'|'reviews'|'contact'>('about')
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newTest, setNewTest]     = useState({ author:'', event:'', text:'', rating:5 })
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const [sRes, tRes] = await Promise.all([
      fetch('/api/site-settings').then(r=>r.json()),
      fetch('/api/testimonials').then(r=>r.json()),
    ])
    setSettings(sRes||{})
    setTests(tRes||[])
  }
  useEffect(()=>{load()},[])

  function set(key:string, value:string){ setSettings(prev=>({...prev,[key]:value})) }

  async function save(keys:string[]){
    setSaving(true)
    const payload:Record<string,string>={}
    keys.forEach(k=>{payload[k]=settings[k]||''})
    const res=await fetch('/api/site-settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    if(res.ok) toast.success('Saved!')
    else toast.error('Save failed')
    setSaving(false)
  }

  async function uploadPhoto(file:File){
    setUploading(true)
    const fd=new FormData();fd.append('file',file)
    const res=await fetch('/api/site-settings/upload',{method:'POST',body:fd})
    const data=await res.json()
    if(res.ok){toast.success('Photo uploaded!');set('about_photo_url',data.url);load()}
    else toast.error(data.error||'Upload failed')
    setUploading(false)
  }

  async function addTestimonial(){
    if(!newTest.author||!newTest.text){toast.error('Name and review required');return}
    const res=await fetch('/api/testimonials',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newTest)})
    if(res.ok){toast.success('Review added!');setNewTest({author:'',event:'',text:'',rating:5});load()}
    else toast.error('Failed')
  }

  async function deleteTestimonial(id:string){
    if(!confirm('Delete this review?'))return
    const res=await fetch('/api/testimonials',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})})
    if(res.ok){toast.success('Deleted!');load()}
  }

  async function toggleTest(id:string,is_active:boolean){
    await fetch('/api/testimonials',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,is_active:!is_active})})
    load()
  }

  const inp={width:'100%',background:'var(--bg)',border:'1.5px solid var(--border)',color:'var(--ink)',padding:'10px 14px',borderRadius:'8px',fontFamily:'inherit',fontSize:'13px',outline:'none',transition:'border-color 0.2s'}
  const lbl={fontSize:'9px',fontWeight:700 as const,letterSpacing:'2px',textTransform:'uppercase' as const,color:'var(--muted2)',display:'block' as const,marginBottom:'5px'}
  const card={background:'#fff',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px',marginBottom:'16px'}
  const secStyle=(active:boolean)=>({padding:'8px 18px',borderRadius:'50px',fontSize:'10px',fontWeight:700 as const,letterSpacing:'0.5px',textTransform:'uppercase' as const,cursor:'pointer',border:`1.5px solid \${active?'var(--coral)':'var(--border)'}`,color:active?'var(--coral)':'var(--muted2)',background:active?'var(--blush)':'#fff',transition:'all 0.2s'})
  const saveBtn=(keys:string[])=>(<button onClick={()=>save(keys)} disabled={saving} style={{padding:'9px 24px',background:'var(--coral)',color:'#fff',borderRadius:'8px',fontSize:'12px',fontWeight:700,border:'none',cursor:'pointer',marginTop:'16px',opacity:saving?0.7:1}}>{saving?'Saving…':'💾 Save Changes'}</button>)

  return (
    <div>
      <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'20px'}}>
        {(['about','services','reviews','contact'] as const).map(id=>(
          <button key={id} onClick={()=>setSection(id)} style={secStyle(section===id)}>
            {id==='about'?'👤 About & Photo':id==='services'?'💄 Services':id==='reviews'?'⭐ Reviews':'📞 Contact'}
          </button>
        ))}
      </div>

      {section==='about' && (
        <>
          <div style={card}>
            <div style={{fontSize:'14px',fontWeight:700,color:'var(--ink)',marginBottom:'16px'}}>👤 Artist Photo</div>
            <div style={{display:'flex',gap:'20px',alignItems:'flex-start',flexWrap:'wrap'}}>
              <div style={{width:'120px',height:'120px',borderRadius:'12px',overflow:'hidden',border:'2px solid var(--border)',flexShrink:0,background:'var(--blush)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                {settings.about_photo_url?(<img src={settings.about_photo_url} alt="Artist" style={{width:'100%',height:'100%',objectFit:'cover'}}/>):(<span style={{fontSize:'40px'}}>👩</span>)}
              </div>
              <div>
                <div style={{fontSize:'13px',color:'var(--muted)',marginBottom:'10px',lineHeight:1.6}}>Upload Sri Pujitha photo for the About section.<br/>Best size: 600x800px portrait. JPG or PNG.</div>
                <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)uploadPhoto(f)}}/>
                <button onClick={()=>fileRef.current?.click()} disabled={uploading} style={{padding:'9px 20px',borderRadius:'8px',background:uploading?'var(--muted2)':'var(--coral)',color:'#fff',fontSize:'12px',fontWeight:700,border:'none',cursor:'pointer'}}>
                  {uploading?'Uploading…':'📷 Upload Photo'}
                </button>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={{fontSize:'14px',fontWeight:700,color:'var(--ink)',marginBottom:'16px'}}>📝 Bio Text</div>
            <label style={lbl}>About Me</label>
            <textarea value={settings.about_bio||''} onChange={e=>set('about_bio',e.target.value)} rows={5} style={{...inp,resize:'vertical' as const}} onFocus={e=>e.target.style.borderColor='var(--coral)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
            {saveBtn(['about_bio'])}
          </div>

          <div style={card}>
            <div style={{fontSize:'14px',fontWeight:700,color:'var(--ink)',marginBottom:'16px'}}>📊 Stats</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
              {[1,2,3,4].map(n=>(
                <div key={n}>
                  <label style={lbl}>Stat {n} Value</label>
                  <input value={settings[`about_stat\${n}`]||''} onChange={e=>set(`about_stat\${n}`,e.target.value)} style={inp} placeholder="e.g. 500+" onFocus={e=>e.target.style.borderColor='var(--coral)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                  <label style={{...lbl,marginTop:'6px'}}>Label</label>
                  <input value={settings[`about_stat\${n}_lbl`]||''} onChange={e=>set(`about_stat\${n}_lbl`,e.target.value)} style={inp} placeholder="e.g. Brides" onFocus={e=>e.target.style.borderColor='var(--coral)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                </div>
              ))}
            </div>
            {saveBtn(['about_stat1','about_stat1_lbl','about_stat2','about_stat2_lbl','about_stat3','about_stat3_lbl','about_stat4','about_stat4_lbl'])}
          </div>

          <div style={card}>
            <div style={{fontSize:'14px',fontWeight:700,color:'var(--ink)',marginBottom:'8px'}}>🏷️ Skill Tags</div>
            <div style={{fontSize:'12px',color:'var(--muted2)',marginBottom:'10px'}}>Comma-separated tags shown below the bio</div>
            <input value={settings.about_tags||''} onChange={e=>set('about_tags',e.target.value)} style={inp} placeholder="Bridal Specialist, Smokey Eye…" onFocus={e=>e.target.style.borderColor='var(--coral)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
            <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginTop:'10px'}}>
              {(settings.about_tags||'').split(',').filter(Boolean).map(t=>(<span key={t} style={{padding:'4px 12px',background:'var(--blush)',border:'1px solid var(--blush3)',borderRadius:'50px',fontSize:'11px',fontWeight:600,color:'var(--coral)'}}>{t.trim()}</span>))}
            </div>
            {saveBtn(['about_tags'])}
          </div>
        </>
      )}

      {section==='services' && (
        <div style={card}>
          <div style={{fontSize:'14px',fontWeight:700,color:'var(--ink)',marginBottom:'16px'}}>💄 Services & Pricing</div>
          <ServiceEditor/>
        </div>
      )}

      {section==='reviews' && (
        <>
          <div style={card}>
            <div style={{fontSize:'14px',fontWeight:700,color:'var(--ink)',marginBottom:'16px'}}>➕ Add New Review</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
              <div>
                <label style={lbl}>Client Name *</label>
                <input value={newTest.author} onChange={e=>setNewTest({...newTest,author:e.target.value})} style={inp} placeholder="e.g. Anjali Reddy" onFocus={e=>e.target.style.borderColor='var(--coral)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
              </div>
              <div>
                <label style={lbl}>Event</label>
                <input value={newTest.event} onChange={e=>setNewTest({...newTest,event:e.target.value})} style={inp} placeholder="e.g. Bridal Makeup · Rajahmundry" onFocus={e=>e.target.style.borderColor='var(--coral)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
              </div>
            </div>
            <div style={{marginBottom:'12px'}}>
              <label style={lbl}>Review Text *</label>
              <textarea value={newTest.text} onChange={e=>setNewTest({...newTest,text:e.target.value})} rows={3} style={{...inp,resize:'vertical' as const}} placeholder="Write the client review here…" onFocus={e=>e.target.style.borderColor='var(--coral)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
            </div>
            <div style={{marginBottom:'12px'}}>
              <label style={lbl}>Rating</label>
              <div style={{display:'flex',gap:'6px'}}>
                {[1,2,3,4,5].map(n=>(<button key={n} onClick={()=>setNewTest({...newTest,rating:n})} style={{fontSize:'20px',background:'none',border:'none',cursor:'pointer',opacity:n<=newTest.rating?1:0.3}}>⭐</button>))}
              </div>
            </div>
            <button onClick={addTestimonial} style={{padding:'10px 24px',background:'var(--coral)',color:'#fff',borderRadius:'8px',fontSize:'12px',fontWeight:700,border:'none',cursor:'pointer'}}>➕ Add Review</button>
          </div>

          <div style={card}>
            <div style={{fontSize:'14px',fontWeight:700,color:'var(--ink)',marginBottom:'16px'}}>⭐ All Reviews ({tests.length})</div>
            {tests.length===0?(<p style={{fontSize:'13px',color:'var(--muted2)',textAlign:'center',padding:'20px'}}>No reviews yet</p>):tests.map(t=>(
              <div key={t.id} style={{padding:'14px',background:'var(--blush)',border:'1px solid var(--blush3)',borderRadius:'10px',marginBottom:'10px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                  <div>
                    <div style={{fontSize:'13px',fontWeight:700,color:'var(--ink)'}}>{t.author}</div>
                    <div style={{fontSize:'11px',color:'var(--muted2)'}}>{t.event}</div>
                    <div>{'⭐'.repeat(t.rating)}</div>
                  </div>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button onClick={()=>toggleTest(t.id,t.is_active)} style={{padding:'4px 10px',borderRadius:'5px',border:`1.5px solid \${t.is_active?'#BBF7D0':'var(--border)'}`,background:t.is_active?'#F0FDF4':'#fff',fontSize:'10px',fontWeight:600,cursor:'pointer',color:t.is_active?'#15803D':'var(--muted)'}}>
                      {t.is_active?'✓ Visible':'○ Hidden'}
                    </button>
                    <button onClick={()=>deleteTestimonial(t.id)} style={{padding:'4px 10px',borderRadius:'5px',border:'1.5px solid #F5C1C1',background:'#FCEAEA',fontSize:'10px',fontWeight:600,cursor:'pointer',color:'#882020'}}>🗑️</button>
                  </div>
                </div>
                <p style={{fontSize:'12px',color:'var(--muted)',lineHeight:1.7,fontStyle:'italic'}}>"{t.text}"</p>
              </div>
            ))}
          </div>
        </>
      )}

      {section==='contact' && (
        <div style={card}>
          <div style={{fontSize:'14px',fontWeight:700,color:'var(--ink)',marginBottom:'16px'}}>📞 Contact Details</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
            {[
              {key:'contact_phone',    label:'Phone Number',    placeholder:'+91 88853 97517'},
              {key:'contact_whatsapp', label:'WhatsApp Number', placeholder:'918885397517'},
              {key:'contact_email',    label:'Email Address',   placeholder:'sripujimakeovers@gmail.com'},
              {key:'contact_address',  label:'Address',         placeholder:'Rajahmundry, East Godavari'},
            ].map(f=>(
              <div key={f.key}>
                <label style={lbl}>{f.label}</label>
                <input value={settings[f.key]||''} onChange={e=>set(f.key,e.target.value)} style={inp} placeholder={f.placeholder} onFocus={e=>e.target.style.borderColor='var(--coral)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
              </div>
            ))}
          </div>
          {saveBtn(['contact_phone','contact_whatsapp','contact_email','contact_address'])}
        </div>
      )}
    </div>
  )
}

function ServiceEditor(){
  const [services,setServices]=useState<any[]>([])
  const [saving,setSaving]=useState<string|null>(null)
  useEffect(()=>{fetch('/api/services').then(r=>r.json()).then(d=>setServices(d||[]))},[])
  function update(id:string,field:string,value:any){setServices(prev=>prev.map(s=>s.id===id?{...s,[field]:value}:s))}
  async function save(svc:any){
    setSaving(svc.id)
    const res=await fetch('/api/services',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:svc.id,name:svc.name,price:svc.price,is_active:svc.is_active})})
    if(res.ok) toast.success(`\${svc.name} saved!`)
    else toast.error('Save failed')
    setSaving(null)
  }
  const inp={background:'var(--bg)',border:'1.5px solid var(--border)',color:'var(--ink)',padding:'8px 12px',borderRadius:'7px',fontFamily:'inherit',fontSize:'12px',outline:'none'}
  return (
    <div>
      {services.map(s=>(
        <div key={s.id} style={{display:'flex',gap:'10px',alignItems:'center',padding:'10px 14px',background:s.is_active?'var(--blush)':'#F9FAFB',border:`1px solid \${s.is_active?'var(--blush3)':'var(--border)'}`,borderRadius:'8px',marginBottom:'8px',flexWrap:'wrap'}}>
          <input value={s.name} onChange={e=>update(s.id,'name',e.target.value)} style={{...inp,flex:2,minWidth:'140px'}} placeholder="Service name"/>
          <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
            <span style={{fontSize:'12px',color:'var(--muted)',fontWeight:600}}>₹</span>
            <input type="number" value={s.price} onChange={e=>update(s.id,'price',parseInt(e.target.value))} style={{...inp,width:'90px'}}/>
          </div>
          <button onClick={()=>update(s.id,'is_active',!s.is_active)} style={{padding:'6px 12px',borderRadius:'6px',border:`1.5px solid \${s.is_active?'#BBF7D0':'var(--border)'}`,background:s.is_active?'#F0FDF4':'#fff',fontSize:'10px',fontWeight:600,cursor:'pointer',color:s.is_active?'#15803D':'var(--muted)',whiteSpace:'nowrap'}}>
            {s.is_active?'✓ Active':'○ Hidden'}
          </button>
          <button onClick={()=>save(s)} disabled={saving===s.id} style={{padding:'6px 14px',borderRadius:'6px',background:saving===s.id?'var(--muted2)':'var(--coral)',color:'#fff',fontSize:'10px',fontWeight:700,border:'none',cursor:'pointer',whiteSpace:'nowrap'}}>
            {saving===s.id?'…':'💾 Save'}
          </button>
        </div>
      ))}
    </div>
  )
}
