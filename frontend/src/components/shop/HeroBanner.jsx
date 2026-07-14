import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HERO_SLIDES } from '../../utils/constants'

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      goToNext()
    }, 5000)
    return () => clearInterval(timer)
  }, [current])

  const goToNext = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent(prev => (prev + 1) % HERO_SLIDES.length)
      setIsAnimating(false)
    }, 300)
  }

  const goToPrev = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
      setIsAnimating(false)
    }, 300)
  }

  const slide = HERO_SLIDES[current]

  return (
    <div className={`relative h-72 md:h-96 lg:h-[480px] rounded-2xl overflow-hidden bg-gradient-to-r ${slide.color} transition-all duration-500`}>

      {/* Content */}
      <div className={`absolute inset-0 flex items-center px-8 md:px-16 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-lg">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            {slide.badge}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">
            {slide.title}
          </h1>
          <p className="text-white/70 text-sm md:text-base mb-2 font-medium">
            {slide.subtitle}
          </p>
          <p className="text-white/50 text-sm mb-6 hidden md:block">
            {slide.description}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-all duration-200 text-sm"
          >
            {slide.cta}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Icon */}
        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 text-8xl md:text-9xl opacity-20 select-none">
          {slide.icon}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

    </div>
  )
}