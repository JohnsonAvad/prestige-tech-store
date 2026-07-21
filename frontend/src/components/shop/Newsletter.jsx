import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setDone(true)
    setLoading(false)
  }

  return (
    <section style={{ background: 'linear-gradient(135deg, #16a34a 0%, #2563eb 100%)', borderRadius: '24px', padding: '48px', textAlign: 'center' }}>
      <div style={{ fontSize: '28px', fontWeight: 900, color: 'white', marginBottom: '8px' }}>Stay in the Loop</div>
      <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
        Exclusive deals, new arrivals and tech news delivered to your inbox
      </div>
      {!done ? (
        <form onSubmit={submit} style={{ display: 'flex', gap: '10px', maxWidth: '420px', margin: '0 auto' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            style={{ flex: 1, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', padding: '13px 16px', color: 'white', fontSize: '13px', outline: 'none' }}
          />
          <button type="submit" disabled={loading} style={{ background: 'white', color: '#16a34a', fontSize: '13px', fontWeight: 900, padding: '13px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {loading ? 'Joining...' : 'Subscribe'}
          </button>
        </form>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', padding: '14px 24px', display: 'inline-block', color: 'white', fontWeight: 600 }}>
          You are subscribed! Watch your inbox for exclusive deals.
        </div>
      )}
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '16px' }}>No spam. Unsubscribe anytime.</div>
    </section>
  )
}