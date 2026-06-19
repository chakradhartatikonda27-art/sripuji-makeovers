export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove XSS chars
    .replace(/javascript:/gi, '') // Remove JS injection
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 500) // Max length
}

export function sanitizeBooking(body: any) {
  return {
    name:         sanitizeString(body.name),
    phone:        sanitizeString(body.phone).replace(/[^0-9+\s-]/g, '').slice(0, 15),
    email:        sanitizeString(body.email).slice(0, 100),
    service:      sanitizeString(body.service).slice(0, 100),
    booking_date: sanitizeString(body.booking_date).replace(/[^0-9-]/g, '').slice(0, 10),
    booking_time: sanitizeString(body.booking_time).slice(0, 20),
    end_time:     sanitizeString(body.end_time).slice(0, 20),
    event_date:   sanitizeString(body.event_date).replace(/[^0-9-]/g, '').slice(0, 10),
    venue:        sanitizeString(body.venue).slice(0, 200),
    notes:        sanitizeString(body.notes).slice(0, 500),
    service_price: typeof body.service_price === 'number' ? body.service_price : 0,
    admin_override: body.admin_override === true,
  }
}
