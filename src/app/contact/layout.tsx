import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Sripuji Makeovers',
  description: 'Contact Sri Pujitha — professional bridal makeup artist in Rajahmundry. Call, WhatsApp or email to discuss your bridal look.',
  openGraph: {
    title: 'Contact | Sripuji Makeovers',
    description: 'Contact Sri Pujitha — professional bridal makeup artist in Rajahmundry.',
    url: 'https://sripuji-makeovers-eight.vercel.app/contact',
    siteName: 'Sripuji Makeovers',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
