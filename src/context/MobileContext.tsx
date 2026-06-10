'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const MobileContext = createContext({ isMobile: false, isTablet: false })

export function MobileProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <MobileContext.Provider value={{ isMobile, isTablet }}>
      {children}
    </MobileContext.Provider>
  )
}

export function useMobile() {
  return useContext(MobileContext)
}
