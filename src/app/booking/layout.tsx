import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Appointment | Sripuji Makeovers',
  description: 'Book your bridal makeup appointment with Sri Pujitha in Rajahmundry. Select your preferred date and time slot.',
  openGraph: {
    title: 'Book Appointment | Sripuji Makeovers',
    description: 'Book your bridal makeup appointment with Sri Pujitha in Rajahmundry.',
    url: 'https://sripuji-makeovers-eight.vercel.app/booking',
    siteName: 'Sripuji Makeovers',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
