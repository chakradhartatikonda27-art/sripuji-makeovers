'use client'
import { useEffect, useState } from 'react'

export default function MobileWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    setReady(true)
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  if (!ready) return <>{children}</>
  return (
    <div data-mobile={isMobile} className={isMobile ? 'is-mobile' : 'is-desktop'}>
      {children}
    </div>
  )
}
