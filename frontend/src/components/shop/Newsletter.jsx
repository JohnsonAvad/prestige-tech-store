import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <section className="bg-gradient-to-r from-blue-600/10 to-green-600/10 border border-white/10 rounded-2xl p-8 md:p-12 text-center">
      <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
        Stay in the Loop
      </h2>
      <p className="text-white/50 text-sm md:text-base mb-8 max-w-md mx-auto">
        Get exclusive deals, new arrivals and tech news delivered to your inbox.
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-blue-500 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 whitespace-nowrap text-sm"
          >
            {loading ? 'Joining...' : 'Subscribe'}
          </button>
        </form>
      ) : (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-6 py-3 inline-block">
          <p className="text-green-400 font-semibold text-sm">
            You are subscribed! Watch your inbox for exclusive deals.
          </p>
        </div>
      )}

      <p className="text-white/20 text-xs mt-4">
        No spam. Unsubscribe anytime.
      </p>
    </section>
  )
}