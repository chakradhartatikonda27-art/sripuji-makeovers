export type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled'

export interface Service {
  id: string
  name: string
  price: number
  unit: string
  description: string
  icon: string
  is_active: boolean
  sort_order: number
}

export interface Booking {
  id: string
  booking_ref: string
  name: string
  phone: string
  email: string | null
  service: string
  service_price: number
  booking_date: string
  booking_time: string
  event_date: string | null
  venue: string | null
  notes: string | null
  status: BookingStatus
  advance_paid: boolean
  created_at: string
  updated_at: string
}

export interface BlockedDate {
  id: string
  blocked_date: string
  reason: string
}

export interface ContactMessage {
  id: string
  name: string
  phone: string
  email: string | null
  service: string | null
  event_date: string | null
  venue: string | null
  message: string | null
  is_read: boolean
  created_at: string
}
