import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SLIDES = [
  {
    id: 1,
    badge: 'New Arrival',
    badgeColor: 'bg-blue-100 text-blue-700',
    title: 'iPhone 15',
    titleAccent: 'Pro Max',
    accentColor: 'text-blue-600',
    subtitle: 'Titanium · A17 Pro · 48MP Camera',
    description: 'Pay with MTN MoMo or Airtel Money.',
    cta: 'Shop Now',
    ctaLink: '/category/smartphones',
    price: 'UGX 4,200,000',
    priceColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    blobColor: 'bg-blue-200',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80',
  },
  {
    id: 2,
    badge: 'Best Seller',
    badgeColor: 'bg-green-100 text-green-700',
    title: 'Samsung Galaxy',
    titleAccent: 'S24 Ultra',
    accentColor: 'text-green-600',
    subtitle: '200MP Camera · Built-in S Pen',
    description: 'Uganda\'s most advanced Android phone.',
    cta: 'View Deal',
    ctaLink: '/category/smartphones',
    price: 'UGX 3,200,000',
    priceColor: 'text-green-600',
    bgColor: 'bg-green-50',
    blobColor: 'bg-green-200',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80',
  },
  {
    id: 3,
    badge: 'Professional',
    badgeColor: 'bg-slate-100 text-slate-700',
    title: 'MacBook Pro',
    titleAccent: 'M3 Chip',
    accentColor: 'text-slate-700',
    subtitle: 'The most powerful Mac ever built',
    description: 'For creators and professionals in Uganda.',
    cta: 'Explore',
    ctaLink: '/category/laptops',
    price: 'UGX 4,500,000',
    priceColor: 'text-slate-700',
    bgColor: 'bg-slate-50',
    blobColor: 'bg-slate-200',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % SLIDES.length)
        setFading(false)
      }, 350)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index) => {
    if (index === current) return
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
    }, 350)
  }

  const slide = SLIDES[current]

  return (
    <div className={`relative w-full overflow-hidden ${slide.bgColor} transition-colors duration-700`}
      style={{ minHeight: '480px' }}
    >

      <div className={`max-w-7xl mx-auto px-6 md:px-12 flex items-center transition-opacity duration-350 ${fading ? 'opacity-0' : 'opacity-100'}`}
        style={{ minHeight: '480px' }}
      >

        {/* Left — Text */}
        <div className="flex-1 py-16 pr-8 z-10">

          <span className={`inline-block ${slide.badgeColor} text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest`}>
            {slide.badge}
          </span>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-none mb-3">
            {slide.title}
            <span className={`block ${slide.accentColor} mt-1`}>
              {slide.titleAccent}
            </span>
          </h1>

          <p className="text-gray-500 text-base md:text-lg font-medium mb-1 mt-4">
            {slide.subtitle}
          </p>
          <p className="text-gray-400 text-sm mb-6">
            {slide.description}
          </p>

          <p className={`text-3xl font-black ${slide.priceColor} mb-8`}>
            {slide.price}
          </p>

          <div className="flex items-center gap-4">
            <Link
              to={slide.ctaLink}
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-black px-8 py-4 rounded-2xl hover:bg-gray-700 transition-all duration-200 text-sm"
            >
              {slide.cta}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to={slide.ctaLink}
              className="text-gray-400 hover:text-gray-600 text-sm font-semibold transition-colors"
            >
              Browse all →
            </Link>
          </div>

        </div>

        {/* Right — Product floating completely free in space */}
        <div className="hidden md:flex flex-1 items-center justify-center relative py-8">

          {/* Decorative blob behind product — NOT a box */}
          <div
            className={`absolute w-80 h-80 ${slide.blobColor} rounded-full opacity-40 blur-3xl`}
            style={{ right: '10%', top: '50%', transform: 'translateY(-50%)' }}
          />

          {/* Product image — pure floating, no container */}
          <img
            src={slide.image}
            alt={slide.title}
            className="relative z-10 object-contain transition-all duration-500"
            style={{
              width: '320px',
              height: '380px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.12))',
            }}
          />

        </div>

      </div>

      {/* Navigation dots — bottom left */}
      <div className="absolute bottom-8 left-6 md:left-12 flex items-center gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-8 h-2.5 bg-gray-900'
                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
        <span className="text-gray-400 text-xs font-medium ml-2">
          {current + 1} / {SLIDES.length}
        </span>
      </div>

    </div>
  )
}