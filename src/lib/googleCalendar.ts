const CLIENT_ID     = process.env.GOOGLE_CLIENT_ID!
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const REDIRECT_URI  = process.env.GOOGLE_REDIRECT_URI!

export function getAuthUrl() {
  const params = new URLSearchParams({
    client_id:     CLIENT_ID,
    redirect_uri:  REDIRECT_URI,
    response_type: 'code',
    scope:         'https://www.googleapis.com/auth/calendar.events',
    access_type:   'offline',
    prompt:        'consent',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export async function getTokens(code: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri:  REDIRECT_URI,
      grant_type:    'authorization_code',
    }),
  })
  return res.json()
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type:    'refresh_token',
    }),
  })
  return res.json()
}

export async function createCalendarEvent(
  accessToken: string,
  booking: {
    name: string
    service: string
    booking_date: string
    booking_time: string
    end_time?: string
    venue?: string
    phone: string
    booking_ref: string
  }
) {
  // Parse start time
  const startDateTime = parseDateTime(booking.booking_date, booking.booking_time)
  const endDateTime   = booking.end_time
    ? parseDateTime(booking.booking_date, booking.end_time)
    : new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000) // default 2 hours

  const event = {
    summary:     `💄 ${booking.name} — ${booking.service}`,
    description: `📱 ${booking.phone}\n🔖 ${booking.booking_ref}\n💄 ${booking.service}`,
    location:    booking.venue || 'Travels to venue',
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'Asia/Kolkata',
    },
    colorId: '11', // Tomato red — bridal theme
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 60 },       // 1 hour before
      ],
    },
  }

  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Calendar event creation failed')
  return data
}

export async function deleteCalendarEvent(accessToken: string, eventId: string) {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
  return res.ok
}

export async function createBlockedEvent(accessToken: string, date: string, reason = 'Blocked') {
  const event = {
    summary:     `🔴 Blocked — ${reason}`,
    start:       { date },
    end:         { date },
    colorId:     '8', // Graphite
    transparency: 'opaque',
  }

  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  )
  return res.json()
}

function parseDateTime(date: string, time: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  const timeUpper = time.toUpperCase()
  const isPM = timeUpper.includes('PM')
  const isAM = timeUpper.includes('AM')
  const timePart = timeUpper.replace(/\s*(AM|PM)/i, '').trim()
  const [hourStr, minuteStr] = timePart.split(':')
  let hour = parseInt(hourStr)
  const minute = parseInt(minuteStr || '0')

  if (isPM && hour !== 12) hour += 12
  if (isAM && hour === 12) hour = 0

  // IST offset = UTC+5:30
  return new Date(Date.UTC(year, month - 1, day, hour - 5, minute - 30))
}
