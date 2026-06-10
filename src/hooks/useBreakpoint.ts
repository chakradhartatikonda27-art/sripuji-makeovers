'use client'
import { useEffect, useState } from 'react'

export function useBreakpoint() {
  const [mounted, setMounted] = useState(false)
  const [width, setWidth]     = useState(1200)

  useEffect(() => {
    setMounted(true)
    setWidth(window.innerWidth)
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  if (!mounted) return { isMobile: false, isTablet: false, isDesktop: true, width: 1200, mounted: false }

  return {
    isMobile:  width < 768,
    isTablet:  width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    width,
    mounted: true,
  }
}
