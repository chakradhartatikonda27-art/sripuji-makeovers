// Read fresh on every call to avoid stale token issues

export async function sendWhatsAppMessage(to: string, message: string) {
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
  const ACCESS_TOKEN    = process.env.WHATSAPP_ACCESS_TOKEN
  console.log('WA Token exists:', !!ACCESS_TOKEN, 'Phone ID:', PHONE_NUMBER_ID)
  const phone = to.replace(/[^0-9]/g, '')
  const fullPhone = phone.startsWith('91') ? phone : `91${phone}`

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: fullPhone,
        type: 'text',
        text: { body: message },
      }),
    }
  )

  const data = await res.json()
  console.log('WhatsApp API response:', JSON.stringify(data).slice(0,200))
  if (!res.ok) {
    console.error('WhatsApp API error:', JSON.stringify(data))
    throw new Error(data.error?.message || 'WhatsApp send failed')
  }
  return data
}

export const WA_MESSAGES = {
  bookingReceived: (name: string, date: string, time: string, ref: string) =>
    `🌸 *Sripuji Makeovers*\n\nHi ${name}! Your booking request has been received.\n\n📅 Date: ${date}\n⏰ Time: ${time}\n🔖 Ref: ${ref}\n\n⏳ Status: *Pending Confirmation*\n\nSri Pujitha will confirm within 2 hours.\n\nTrack booking: https://sripuji-makeovers-eight.vercel.app/booking/status`,

  bookingConfirmed: (name: string, date: string, time: string, service: string, ref: string) =>
    `✅ *Booking Confirmed!*\n\nHi ${name}! Your appointment is confirmed! 🎉\n\n💄 Service: ${service}\n📅 Date: ${date}\n⏰ Time: ${time}\n🔖 Ref: ${ref}\n\nSri Pujitha will travel to your venue.\nPlease be ready 15 mins before your appointment.\n\n_Sripuji Makeovers_ 🌸`,

  bookingRejected: (name: string, date: string, time: string) =>
    `❌ *Booking Update*\n\nHi ${name}, unfortunately we couldn't confirm your appointment for ${date} at ${time}.\n\nPlease book another slot:\nhttps://sripuji-makeovers-eight.vercel.app/booking\n\nOr contact us:\nwa.me/918885397517\n\n_Sorry for the inconvenience! 🙏_`,

  reminder5Days: (name: string, date: string, time: string, service: string) =>
    `🌸 *Appointment Reminder*\n\nHi ${name}! Your appointment is in *5 days*.\n\n💄 Service: ${service}\n📅 Date: ${date}\n⏰ Time: ${time}\n\nPlease confirm your venue. Any questions? Reply here! 😊`,

  reminder1Day: (name: string, date: string, time: string, venue: string) =>
    `⏰ *Tomorrow is Your Big Day!*\n\nHi ${name}! Your appointment is *tomorrow*!\n\n📅 Date: ${date}\n⏰ Time: ${time}\n📍 Venue: ${venue || 'Please confirm venue'}\n\nSri Pujitha will be there on time! 💄✨`,

  reminderEventDay: (name: string, time: string) =>
    `🌸 *Today is Your Special Day!*\n\nHi ${name}! Today is the big day! 🎉\n\n⏰ Sri Pujitha arrives at: ${time}\n\nGet ready to look absolutely stunning! 💄\n\n_Sripuji Makeovers_ 🌺`,

  postService: (name: string) =>
    `🌸 *Thank You ${name}!*\n\nThank you for choosing Sripuji Makeovers! 💄\n\nWe hope you loved your look! 😍\n\n⭐ Leave a review:\nhttps://sripuji-makeovers-eight.vercel.app/reviews\n\n_See you next time!_\n— Sri Pujitha 🌺`,
}
