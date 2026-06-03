export const SITE = {
  name:         'Sripuji Makeovers',
  tagline:      'Professional Makeup Artist · Rajahmundry',
  description:  'Sri Pujitha — professional bridal makeup artist in Rajahmundry, East Godavari. Glamorous, minimalistic & smokey-eyed bridal looks with 100% genuine premium international products.',
  url:          'https://www.sripujimakeovers.com',
  phone:        '+918885397517',
  phoneDisplay: '+91 88853 97517',
  email:        'sripujimakeovers@gmail.com',
  address:      'Rajahmundry, East Godavari, Andhra Pradesh, India',
  instagram:    'https://www.instagram.com/sripuji_makeovers/',
  youtube:      'https://www.youtube.com/channel/UCIvr6tmV__RnczpydCsuIfA',
  whatsapp:     'https://wa.me/918885397517',
  founded:      '2023',
}

export const TIME_SLOTS = [
  '8:00 AM','9:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','1:00 PM','2:00 PM','3:00 PM',
  '4:00 PM','5:00 PM','6:00 PM','7:00 PM',
]

export const BRANDS = [
  'NARS','Huda Beauty','Tarte','Laura Mercier','Inglot',
  'P.Louise','MAC','Sephora','Anastasia Beverly Hills',
  'OFRA Cosmetics','Fenty Beauty','Bobbi Brown',
]

export const TESTIMONIALS = [
  { text: 'Sri Pujitha transformed me into the most radiant version of myself. Her attention to detail was beyond expectations!', author: 'Lakshmi Priya', event: 'Bridal Makeup · Rajahmundry', rating: 5 },
  { text: 'Absolutely loved my engagement makeup! Lasted all day without a touch-up. Every photo came out stunning.', author: 'Anjali Reddy', event: 'Engagement Makeup · East Godavari', rating: 5 },
  { text: 'Perfect saree draping and exactly the minimalistic look I wanted. Very professional and punctual.', author: 'Divya Srinivas', event: 'Reception Makeup · Rajahmundry', rating: 5 },
  { text: 'Got my maternity photoshoot done — I was glowing! Puji understood the vibe perfectly.', author: 'Sudha Rao', event: 'Maternity Photoshoot · Rajahmundry', rating: 5 },
  { text: 'My husband got groom makeup too — he looked amazing! Flawless first-time experience.', author: 'Meena & Ravi Kumar', event: 'Bridal + Groom · East Godavari', rating: 5 },
  { text: 'Instant WhatsApp confirmation. Half saree function makeup was gorgeous — everyone was complimenting!', author: 'Preethi Varma', event: 'Half Saree Function · Rajahmundry', rating: 5 },
]

export const NAV_LINKS = [
  { label: 'About',     href: '/#about' },
  { label: 'Services',  href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Reviews',   href: '/#reviews' },
  { label: 'Contact',   href: '/contact' },
  { label: 'Admin',     href: '/admin' },
]

export const PORTFOLIO_ITEMS = [
  { label: 'Traditional Bridal', category: 'Bridal',      bg: 'linear-gradient(155deg,#E07068,#B83838)', tall: true  },
  { label: 'Reception Glam',     category: 'Bridal',      bg: 'linear-gradient(155deg,#C898C8,#7848A0)', tall: false },
  { label: 'Groom Grooming',     category: 'Groom',       bg: 'linear-gradient(155deg,#6888A0,#384858)', tall: false },
  { label: 'Pre-Wedding Shoot',  category: 'Photoshoot',  bg: 'linear-gradient(155deg,#E898B0,#B85878)', tall: false },
  { label: 'Engagement Glow',    category: 'Engagement',  bg: 'linear-gradient(155deg,#F0A080,#C87050)', tall: true  },
  { label: 'Smokey Eye',         category: 'Bridal',      bg: 'linear-gradient(155deg,#9888C0,#584868)', tall: false },
  { label: 'Maternity Glow',     category: 'Photoshoot',  bg: 'linear-gradient(155deg,#F0C098,#C89060)', tall: false },
  { label: 'Half Saree',         category: 'Function',    bg: 'linear-gradient(155deg,#E8C878,#A08838)', tall: false },
  { label: 'Minimalist Bride',   category: 'Bridal',      bg: 'linear-gradient(155deg,#F0B8C0,#C87080)', tall: true  },
  { label: 'Saree Draping',      category: 'Function',    bg: 'linear-gradient(155deg,#D0B080,#887030)', tall: false },
  { label: 'Bridal Portraits',   category: 'Bridal',      bg: 'linear-gradient(155deg,#F0A0B0,#C06070)', tall: false },
  { label: 'Mehendi Makeup',     category: 'Function',    bg: 'linear-gradient(155deg,#E0C060,#988020)', tall: false },
]

export const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'BeautySalon'],
  name: 'Sripuji Makeovers',
  description: 'Professional bridal makeup artist in Rajahmundry, East Godavari, Andhra Pradesh.',
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Rajahmundry',
    addressRegion: 'Andhra Pradesh',
    postalCode: '533101',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 17.0005, longitude: 81.804 },
  sameAs: [SITE.instagram, SITE.youtube],
}
