import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SLIDES = [
  {
    id: 1,
    badge: 'New Arrival',
    badgeColor: 'bg-blue-100 text-blue-700',
    title: 'iPhone 15',
    titleAccent: 'Pro Max',
    subtitle: 'Titanium design meets A17 Pro performance',
    description: 'Pay with MTN MoMo or Airtel Money. Same-day delivery in Kampala.',
    cta: 'Shop Now',
    ctaLink: '/category/smartphones',
    bgFrom: 'from-blue-50',
    bgTo: 'to-white',
    accentColor: 'text-blue-600',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
    price: 'UGX 4,200,000',
  },
  {
    id: 2,
    badge: 'Best Seller',
    badgeColor: 'bg-green-100 text-green-700',
    title: 'Samsung Galaxy',
    titleAccent: 'S24 Ultra',
    subtitle: '200MP camera · Built-in S Pen · AI features',
    description: 'Uganda\'s most advanced Android smartphone. In stock now.',
    cta: 'View Deal',
    ctaLink: '/category/smartphones',
    bgFrom: 'from-green-50',
    bgTo: 'to-white',
    accentColor: 'text-green-600',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
    price: 'UGX 3,200,000',
  },
  {
    id: 3,
    badge: 'Professional',
    badgeColor: 'bg-purple-100 text-purple-700',
    title: 'MacBook Pro',
    titleAccent: 'M3 Pro',
    subtitle: 'The most powerful MacBook ever built',
    description: 'For creators, developers and professionals in Uganda.',
    cta: 'Explore',
    ctaLink: '/category/laptops',
    bgFrom: 'from-slate-50',
    bgTo: 'to-white',
    accentColor: 'text-slate-700',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    price: 'UGX 4,500,000',
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
      }, 400)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index) => {
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
    }, 400)
  }

  const slide = SLIDES[current]

  return (
    <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${slide.bgFrom} ${slide.bgTo} transition-all duration-500`}
      style={{ minHeight: '420px' }}
    >
      <div className={`flex items-center transition-opacity duration-400 ${fading ? 'opacity-0' : 'opacity-100'}`}
        style={{ minHeight: '420px' }}
      >

        {/* Left — Text Content */}
        <div className="flex-1 px-8 md:px-16 py-12 md:py-16 z-10">

          {/* Badge */}
          <span className={`inline-block ${slide.badgeColor} text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wide`}>
            {slide.badge}
          </span>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-3">
            {slide.title}
            <span className={`block ${slide.accentColor}`}>
              {slide.titleAccent}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-base md:text-lg font-medium mb-2">
            {slide.subtitle}
          </p>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 hidden md:block">
            {slide.description}
          </p>

          {/* Price */}
          <p className={`text-2xl font-black ${slide.accentColor} mb-8`}>
            {slide.price}
          </p>

          {/* CTA */}
          <Link
            to={slide.ctaLink}
            className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-gray-700 transition-all duration-200 text-sm"
          >
            {slide.cta}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

        </div>

        {/* Right — Product Image Floating Freely */}
        <div className="hidden md:flex flex-1 items-center justify-center relative py-8 pr-8">

          {/* Subtle glow behind product */}
          <div className={`absolute w-72 h-72 rounded-full blur-3xl opacity-20 ${
            current === 0 ? 'bg-blue-400' :
            current === 1 ? 'bg-green-400' :
            'bg-slate-400'
          }`} />

          {/* Product image — no box, just floating in space */}
          <img
            src={slide.image}
            alt={slide.title}
            className="relative z-10 w-72 h-72 object-contain drop-shadow-2xl transition-all duration-500"
            style={{
              filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))'
            }}
          />

        </div>

      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-8 md:left-16 flex items-center gap-2">
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
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-8 text-gray-400 text-xs font-medium">
        {current + 1} / {SLIDES.length}
      </div>

    </div>
  )
}