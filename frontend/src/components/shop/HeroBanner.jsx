import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SLIDES = [
  {
    id: 1,
    badge: 'New Arrival',
    badgeBg: '#dbeafe',
    badgeColor: '#1d4ed8',
    title: 'iPhone 15',
    accent: 'Pro Max',
    accentColor: '#2563eb',
    sub: 'Titanium · A17 Pro · 48MP Camera',
    desc: 'Pay with MTN MoMo or Airtel Money. Same-day delivery in Kampala.',
    price: 'UGX 4,200,000',
    priceColor: '#2563eb',
    bg: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 60%, #ffffff 100%)',
    blob: '#bfdbfe',
    cta: 'Shop Now',
    link: '/category/smartphones',
    img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=90',
  },
  {
    id: 2,
    badge: 'Best Seller',
    badgeBg: '#dcfce7',
    badgeColor: '#166534',
    title: 'Samsung Galaxy',
    accent: 'S24 Ultra',
    accentColor: '#16a34a',
    sub: '200MP Camera · Built-in S Pen · AI Features',
    desc: "Uganda's most advanced Android smartphone. In stock now.",
    price: 'UGX 3,200,000',
    priceColor: '#16a34a',
    bg: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 60%, #ffffff 100%)',
    blob: '#bbf7d0',
    cta: 'View Deal',
    link: '/category/smartphones',
    img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=90',
  },
  {
    id: 3,
    badge: 'Professional',
    badgeBg: '#f1f5f9',
    badgeColor: '#475569',
    title: 'MacBook Pro',
    accent: 'M3 Chip',
    accentColor: '#334155',
    sub: 'The most powerful Mac ever built',
    desc: 'For creators, developers and professionals in Uganda.',
    price: 'UGX 4,500,000',
    priceColor: '#334155',
    bg: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 60%, #ffffff 100%)',
    blob: '#e2e8f0',
    cta: 'Explore',
    link: '/category/laptops',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=90',
  },
]

export default function HeroBanner() {
  const [cur, setCur] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true)
      setTimeout(() => { setCur(p => (p + 1) % SLIDES.length); setFading(false) }, 400)
    }, 5500)
    return () => clearInterval(t)
  }, [])

  const goTo = (i) => {
    if (i === cur) return
    setFading(true)
    setTimeout(() => { setCur(i); setFading(false) }, 400)
  }

  const s = SLIDES[cur]

  return (
    <div style={{ background: s.bg, minHeight: '520px', position: 'relative', overflow: 'hidden', transition: 'background 0.6s ease' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', minHeight: '520px', opacity: fading ? 0 : 1, transition: 'opacity 0.4s ease' }}>

        {/* LEFT — text */}
        <div style={{ flex: '0 0 45%', paddingRight: '48px', zIndex: 2 }}>
          <span style={{ display: 'inline-block', background: s.badgeBg, color: s.badgeColor, fontSize: '11px', fontWeight: 900, padding: '6px 16px', borderRadius: '20px', marginBottom: '20px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            {s.badge}
          </span>

          <div style={{ fontSize: '60px', fontWeight: 900, color: '#0f172a', lineHeight: 1, marginBottom: '4px' }}>
            {s.title}
          </div>
          <div style={{ fontSize: '60px', fontWeight: 900, color: s.accentColor, lineHeight: 1, marginBottom: '20px' }}>
            {s.accent}
          </div>

          <div style={{ fontSize: '16px', color: '#64748b', fontWeight: 500, marginBottom: '6px' }}>
            {s.sub}
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
            {s.desc}
          </div>

          <div style={{ fontSize: '32px', fontWeight: 900, color: s.priceColor, marginBottom: '28px' }}>
            {s.price}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to={s.link} style={{ background: '#0f172a', color: 'white', fontSize: '13px', fontWeight: 900, padding: '14px 32px', borderRadius: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              {s.cta} →
            </Link>
            <Link to={s.link} style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              Browse all
            </Link>
          </div>
        </div>

        {/* RIGHT — product completely free in space, no box */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: '520px' }}>
          {/* decorative blob behind product */}
          <div style={{ position: 'absolute', width: '380px', height: '380px', borderRadius: '50%', background: s.blob, opacity: 0.5, filter: 'blur(70px)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          {/* product image — pure float, zero container */}
          <img
            src={s.img}
            alt={s.title}
            style={{ position: 'relative', zIndex: 2, width: '420px', height: '460px', objectFit: 'contain', filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.15))', transition: 'all 0.5s ease' }}
          />
        </div>

      </div>

      {/* dots */}
      <div style={{ position: 'absolute', bottom: '28px', left: '48px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{ border: 'none', cursor: 'pointer', background: i === cur ? '#0f172a' : '#cbd5e1', height: '9px', width: i === cur ? '28px' : '9px', borderRadius: '5px', transition: 'all 0.3s', padding: 0 }} />
        ))}
        <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '6px' }}>{cur + 1} / {SLIDES.length}</span>
      </div>
    </div>
  )
}