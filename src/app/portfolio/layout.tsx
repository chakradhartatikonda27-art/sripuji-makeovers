import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio | Sripuji Makeovers',
  description: 'View Sri Pujitha\'s bridal makeup portfolio. Glamorous, minimalistic and smokey-eyed looks for brides across Rajahmundry.',
  openGraph: {
    title: 'Portfolio | Sripuji Makeovers',
    description: 'View Sri Pujitha\'s bridal makeup portfolio.',
    url: 'https://sripuji-makeovers-eight.vercel.app/portfolio',
    siteName: 'Sripuji Makeovers',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
