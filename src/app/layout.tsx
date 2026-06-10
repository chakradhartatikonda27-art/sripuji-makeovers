import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'
import { LOCAL_BUSINESS_SCHEMA, SITE } from '@/lib/constants'
import '@/styles/globals.css'
import { MobileProvider } from '@/context/MobileContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', style: ['normal', 'italic'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Bridal Makeup Artist Rajahmundry`, template: `%s | ${SITE.name}` },
  description: SITE.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <MobileProvider>{children}</MobileProvider>
        <Toaster position="bottom-right"
          toastOptions={{ style: { fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: '600', borderRadius: '8px', background: '#1A1A1A', color: '#fff' },
            success: { style: { background: '#2D7A4F' } }, error: { style: { background: '#B02020' } } }} />
        <Script id="schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }} />
      </body>
    </html>
  )
}
