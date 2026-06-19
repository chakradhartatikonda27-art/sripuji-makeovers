import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'
import { LOCAL_BUSINESS_SCHEMA, SITE } from '@/lib/constants'
import { MobileProvider } from '@/context/MobileContext'
import '@/styles/globals.css'

const inter    = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', style: ['normal', 'italic'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://sripuji-makeovers-eight.vercel.app'),
  title: {
    default:  'Sripuji Makeovers | Bridal Makeup Artist Rajahmundry',
    template: '%s | Sripuji Makeovers',
  },
  description: 'Sri Pujitha — professional bridal makeup artist in Rajahmundry, East Godavari. Specialising in glamorous, minimalistic & smokey-eyed bridal looks with 100% genuine premium international products. Travels to your venue.',
  keywords: [
    'bridal makeup artist Rajahmundry',
    'makeup artist East Godavari',
    'bridal makeup Rajahmundry',
    'wedding makeup artist Andhra Pradesh',
    'professional makeup artist Rajahmundry',
    'Sri Pujitha makeup',
    'Sripuji Makeovers',
    'bridal makeup artist near me',
    'engagement makeup Rajahmundry',
    'reception makeup East Godavari',
  ],
  authors: [{ name: 'Sri Pujitha', url: 'https://sripuji-makeovers-eight.vercel.app' }],
  creator: 'Sri Pujitha',
  publisher: 'Sripuji Makeovers',
  category: 'Beauty & Personal Care',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://sripuji-makeovers-eight.vercel.app',
    siteName: 'Sripuji Makeovers',
    title: 'Sripuji Makeovers | Bridal Makeup Artist Rajahmundry',
    description: 'Professional bridal makeup artist in Rajahmundry. Glamorous, minimalistic & smokey-eyed looks. Travels to your venue across East Godavari.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Sripuji Makeovers — Bridal Makeup Artist Rajahmundry',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sripuji Makeovers | Bridal Makeup Artist Rajahmundry',
    description: 'Professional bridal makeup artist in Rajahmundry. Travels to your venue.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://sripuji-makeovers-eight.vercel.app',
  },
  verification: {
    google: 'google8ba5529027d804a4',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <MobileProvider>
          {children}
        </MobileProvider>
        <Toaster position="bottom-right"
          toastOptions={{
            style: { fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: '600', borderRadius: '8px', background: '#1A1A1A', color: '#fff' },
            success: { style: { background: '#2D7A4F' } },
            error:   { style: { background: '#B02020' } },
          }} />
        <Script id="schema" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }} />
      </body>
    </html>
  )
}
