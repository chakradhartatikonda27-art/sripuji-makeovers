'use client'
import { useState, useEffect } from 'react'
export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])
  if (!visible) return null
  return (
    <a href="https://wa.me/918885397517" target="_blank" rel="noopener noreferrer" style={{ position:'fixed', bottom:'24px', right:'24px', width:'60px', height:'60px', background:'#25D366', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 20px rgba(37,211,102,0.45)', zIndex:9999, textDecoration:'none', fontSize:'30px' }}>
      💬
    </a>
  )
}
