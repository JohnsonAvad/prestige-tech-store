import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import { formatPrice } from '../../utils/formatters'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([])
  const { isAuthenticated } = useAuthStore()
  const { addItem } = useCartStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/account/wishlist')
      return
    }
    const saved = localStorage.getItem('wishlist')
    if (saved) setWishlist(JSON.parse(saved))
  }, [])

  const removeFromWishlist = (productId) => {
    const updated = wishlist.filter(p => p.id !== productId)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  const addToCart = (product) => {
    addItem(product)
    removeFromWishlist(product.id)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}>My Wishlist</h1>
          <p style={{ fontSize: '14px', color: '#1d4ed8', fontWeight: 600 }}>{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
        </div>

        {wishlist.length === 0 ? (
          <div style={{ borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden', textAlign: 'center' }}>
            <div style={{ background: '#16a34a', padding: '20px 24px' }}>
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>Your Wishlist is Empty</p>
            </div>
            <div style={{ background: 'white', padding: '48px 24px' }}>
              <div style={{ width: '72px', height: '72px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>No saved items yet</h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Click the heart icon on any product to save it here</p>
              <Link to="/" style={{ background: '#16a34a', color: 'white', padding: '12px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
                Browse Products
              </Link>
            </div>
            <div style={{ background: '#eff6ff', borderTop: '2px solid #bfdbfe', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600 }}>Your wishlist is saved securely</span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {wishlist.map(product => (
              <div key={product.id} style={{ borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden' }}>

                {/* Green header */}
                <div style={{ background: '#16a34a', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>{product.brand}</span>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', width: '26px', height: '26px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Product image */}
                <Link to={'/product/' + (product.slug || product.id)} style={{ display: 'block', background: 'white', padding: '16px', textDecoration: 'none' }}>
                  <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))' }} />
                    ) : (
                      <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '12px' }} />
                    )}
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', lineHeight: 1.4, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</p>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: '#16a34a' }}>{formatPrice(product.price)}</p>
                </Link>

                {/* Light blue section */}
                <div style={{ background: '#eff6ff', borderTop: '1px solid #bfdbfe', padding: '10px 14px' }}>
                  <button
                    onClick={() => addToCart(product)}
                    style={{ width: '100%', background: '#16a34a', color: 'white', fontWeight: 700, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Add to Cart
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
      <Footer />
    </div>
  )
}