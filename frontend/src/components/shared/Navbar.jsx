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
    { name: 'SmartHome', slug: 'smarthome' },
    { name: 'Speakers', slug: 'speakers' },
    { name: 'Networking', slug: 'networking' },
    { name: 'Storage', slug: 'storage' },
  ]

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>

      {/* Green navbar */}
      <div style={{ background: '#16a34a' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '60px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '36px', height: '36px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#16a34a', fontSize: '17px' }}>P</div>
            <div>
              <div style={{ fontWeight: 900, color: 'white', fontSize: '14px', lineHeight: 1 }}>PRESTIGE</div>
              <div style={{ color: '#bbf7d0', fontSize: '9px', letterSpacing: '2px' }}>TECHSTORE</div>
            </div>
          </Link>

          {/* Search */}
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

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>

            {/* Account */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setOpen(!open)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, padding: '8px 12px', borderRadius: '10px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  {user?.name?.split(' ')[0]}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {open && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '8px', width: '200px', background: 'white', borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', overflow: 'hidden', zIndex: 200 }}>
                    <div style={{ background: '#16a34a', padding: '12px 16px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>{user?.name}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{user?.email}</p>
                    </div>
                    <Link to="/account/orders" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', color: '#0f172a', textDecoration: 'none', fontSize: '13px', fontWeight: 500, borderBottom: '1px solid #f1f5f9' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                      My Orders
                    </Link>
                    <Link to="/account/wishlist" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', color: '#0f172a', textDecoration: 'none', fontSize: '13px', fontWeight: 500, borderBottom: '1px solid #f1f5f9' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                      Wishlist
                    </Link>
                    <Link to="/account/profile" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', color: '#0f172a', textDecoration: 'none', fontSize: '13px', fontWeight: 500, borderBottom: '1px solid #f1f5f9' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      My Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setOpen(false) }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, width: '100%', textAlign: 'left' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 600, padding: '8px 12px', borderRadius: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Sign In
              </Link>
            )}

            {/* Cart */}
            <button onClick={openCart} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, padding: '8px 12px', borderRadius: '10px', position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              Cart
              {count > 0 && (
                <span style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', background: '#2563eb', color: 'white', fontSize: '9px', fontWeight: 900, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {count}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* White category bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '2px', height: '38px', alignItems: 'center', overflowX: 'auto' }} className="hide-scrollbar">
          {cats.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              style={{ whiteSpace: 'nowrap', fontSize: '12px', fontWeight: 600, color: '#64748b', padding: '5px 12px', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s' }}
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