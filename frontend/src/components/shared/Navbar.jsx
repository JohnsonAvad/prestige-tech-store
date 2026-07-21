import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'

export default function Navbar() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const { getItemCount, openCart } = useCartStore()
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const count = getItemCount()

  const search = (e) => {
    e.preventDefault()
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const cats = [
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Tablets', slug: 'tablets' },
    { name: 'Monitors', slug: 'monitors' },
    { name: 'Headphones', slug: 'headphones' },
    { name: 'Smartwatches', slug: 'smartwatches' },
    { name: 'Power Banks', slug: 'power-banks' },
    { name: 'Cameras', slug: 'cameras' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Gaming', slug: 'gaming' },
  ]

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Green bar */}
      <div style={{ background: '#16a34a' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '60px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '36px', height: '36px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#16a34a', fontSize: '17px' }}>P</div>
            <div style={{ display: 'none' }} className="md:block">
              <div style={{ fontWeight: 900, color: 'white', fontSize: '14px', lineHeight: 1 }}>PRESTIGE</div>
              <div style={{ color: '#bbf7d0', fontSize: '9px', letterSpacing: '2px' }}>TECHSTORE</div>
            </div>
          </Link>

          <form onSubmit={search} style={{ flex: 1, maxWidth: '500px' }}>
            <div style={{ position: 'relative' }}>
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search laptops, phones, cameras..."
                style={{ width: '100%', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', padding: '10px 42px 10px 16px', color: 'white', fontSize: '13px', outline: 'none' }}
              />
              <button type="submit" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
            {isAuthenticated ? (
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, padding: '8px 12px', borderRadius: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {user?.name?.split(' ')[0]}
              </button>
            ) : (
              <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 600, padding: '8px 12px', borderRadius: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Sign In
              </Link>
            )}

            <button onClick={openCart} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, padding: '8px 12px', borderRadius: '10px', position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              Cart
              {count > 0 && <span style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', background: '#2563eb', color: 'white', fontSize: '9px', fontWeight: 900, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* White category bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '2px', height: '38px', alignItems: 'center', overflowX: 'auto' }} className="hide-scrollbar">
          {cats.map(cat => (
            <Link key={cat.slug} to={`/category/${cat.slug}`} style={{ whiteSpace: 'nowrap', fontSize: '12px', fontWeight: 600, color: '#64748b', padding: '5px 12px', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.color = '#16a34a'; e.target.style.background = '#f0fdf4' }}
              onMouseLeave={e => { e.target.style.color = '#64748b'; e.target.style.background = 'transparent' }}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}