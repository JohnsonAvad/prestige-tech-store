import { useState, useEffect } from 'react'

function useCountdown(targetDate) {
  const calculateTimeLeft = () => {
    const now = new Date().getTime()
    const target = new Date(targetDate).getTime()
    const difference = target - now

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return timeLeft
}

function CountdownBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 md:w-28 md:h-28 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
        <span className="text-4xl md:text-6xl font-black text-white">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-3 text-xs md:text-sm font-semibold tracking-widest text-white/40 uppercase">
        {label}
      </span>
    </div>
  )
}

export default function ComingSoon() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const launchDate = new Date()
  launchDate.setDate(launchDate.getDate() + 25)
  const { days, hours, minutes, seconds } = useCountdown(launchDate)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitted(true)
    setLoading(false)
  }

  const whatsappNumber = '256704068865'
  const whatsappMsg = encodeURIComponent(
    'Hello Prestige TechStore! I heard you are launching soon. I would like to know more.'
  )

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden flex flex-col">

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
            <span className="font-bold text-white text-lg">P</span>
          </div>
          <div>
            <div className="font-bold text-white text-lg leading-none tracking-wide">
              PRESTIGE
            </div>
            <div className="text-xs text-white/40 tracking-widest uppercase">
              TechStore
            </div>
          </div>
        </div>

        {/* Navbar buttons */}
        <div className="flex items-center gap-3">

          {/* Admin Access button */}
          
            href="/admin/login"
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/50 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/10 hover:text-white transition-all duration-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden md:inline">Admin</span>
          </a>

          {/* WhatsApp button */}
          
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-500/20 transition-all duration-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.524 3.655 1.435 5.163L2 22l4.837-1.435A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm4.92 13.37c-.194.547-1.14 1.048-1.566 1.102-.399.05-.902.072-1.456-.091a13.31 13.31 0 01-1.317-.487c-2.314-1-3.82-3.353-3.937-3.51-.116-.156-.95-1.264-.95-2.41s.6-1.712.814-1.945c.213-.233.464-.29.619-.29l.446.008c.143.006.335-.054.524.4.194.465.66 1.607.717 1.724.058.116.097.252.02.406-.078.155-.117.252-.232.388-.116.135-.244.302-.349.406-.116.116-.236.241-.101.473.135.232.6.99 1.288 1.603.885.787 1.631 1.03 1.864 1.146.232.116.368.097.503-.058.136-.155.582-.678.737-.91.154-.232.31-.194.522-.116.214.077 1.355.64 1.588.756.233.116.388.174.446.271.058.097.058.561-.136 1.108z" />
            </svg>
            <span className="hidden md:inline">Chat with us</span>
          </a>

        </div>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-12 py-12 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/30 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-blue-300 tracking-wide">
            Launching in Uganda
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-black text-5xl md:text-7xl lg:text-8xl text-white leading-none mb-6">
          SOMETHING
          <span className="block bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            EXCITING
          </span>
          IS COMING
        </h1>

        {/* Description */}
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mb-4">
          Uganda's most premium tech store is almost ready.
          Genuine laptops, smartphones, cameras and accessories
          delivered to your door.
        </p>

        <p className="text-white/40 text-sm md:text-base mb-12">
          MTN Mobile Money · Airtel Money · Same-day delivery in Kampala
        </p>

        {/* Countdown timer */}
        <div className="flex items-start gap-4 md:gap-8 mb-16">
          <CountdownBox value={days} label="Days" />
          <div className="text-white/20 font-bold text-4xl md:text-6xl mt-4 md:mt-6">:</div>
          <CountdownBox value={hours} label="Hours" />
          <div className="text-white/20 font-bold text-4xl md:text-6xl mt-4 md:mt-6">:</div>
          <CountdownBox value={minutes} label="Minutes" />
          <div className="text-white/20 font-bold text-4xl md:text-6xl mt-4 md:mt-6">:</div>
          <CountdownBox value={seconds} label="Seconds" />
        </div>

        {/* Email signup */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <p className="text-white/50 text-sm mb-4">
              Be the first to know when we launch and get an exclusive discount
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-blue-500 transition-all duration-200"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 whitespace-nowrap text-sm"
              >
                {loading ? 'Joining...' : 'Notify Me'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl px-8 py-4 text-green-400 font-semibold">
            You are on the list! We will notify you on launch day.
          </div>
        )}

        {/* Server Status */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-12 mb-4">
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-semibold">Website Live</span>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-semibold">Database Connected</span>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-semibold">Security Active</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-blue-400 text-xs font-semibold">Payments Coming Soon</span>
          </div>
        </div>

        {/* Product categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full max-w-3xl">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-blue-500/30 transition-all duration-200">
            <span className="text-3xl">💻</span>
            <span className="text-white/60 text-xs font-medium text-center">Laptops and PCs</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-blue-500/30 transition-all duration-200">
            <span className="text-3xl">📱</span>
            <span className="text-white/60 text-xs font-medium text-center">Smartphones</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-blue-500/30 transition-all duration-200">
            <span className="text-3xl">📷</span>
            <span className="text-white/60 text-xs font-medium text-center">Cameras and Drones</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-blue-500/30 transition-all duration-200">
            <span className="text-3xl">🎧</span>
            <span className="text-white/60 text-xs font-medium text-center">Accessories</span>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-6">
        <div className="flex items-center justify-center gap-6 mb-4">

          <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-green-400 transition-colors duration-200 text-sm font-medium">
            WhatsApp
          </a>

          <span className="text-white/10">·</span>

          <a href="#"
            className="text-white/30 hover:text-white transition-colors duration-200 text-sm font-medium">
            Facebook
          </a>

          <span className="text-white/10">·</span>

          <a href="#"
            className="text-white/30 hover:text-white transition-colors duration-200 text-sm font-medium">
            Instagram
          </a>

        </div>
        <p className="text-white/20 text-xs">
          2026 Prestige TechStore · Kampala, Uganda · All rights reserved
        </p>
      </footer>

    </div>
  )
}