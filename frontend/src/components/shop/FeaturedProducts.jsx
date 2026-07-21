import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { formatPrice } from '../../utils/formatters'
import useCartStore from '../../store/cartStore'

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()

  useEffect(() => {
    api.get('/products?isFeatured=true&limit=8')
      .then(res => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <section style={{ background: '#f8fafc', borderRadius: '24px', padding: '32px' }}>
      <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', marginBottom: '24px' }}>Featured Products</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ padding: '16px' }}>
            <div style={{ height: '130px', background: '#e2e8f0', borderRadius: '12px', marginBottom: '10px' }} />
            <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', marginBottom: '6px', width: '50%' }} />
            <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '5px' }} />
          </div>
        ))}
      </div>
    </section>
  )

  if (products.length === 0) return null

  return (
    <section style={{ background: '#f8fafc', borderRadius: '24px', padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>Featured Products</div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Handpicked for you</div>
        </div>
        <Link to="/products" style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a', textDecoration: 'none' }}>View all →</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
        {products.map(product => {
          const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0
          return (
            <div key={product.id} style={{ padding: '12px', cursor: 'pointer', borderRadius: '16px', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'white'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Link to={`/product/${product.slug || product.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '12px' }}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.08))', transition: 'transform 0.3s' }}
                      onMouseEnter={e => e.target.style.transform = 'translateY(-3px)'}
                      onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                    />
                  ) : (
                    <div style={{ width: '60px', height: '60px', background: '#e2e8f0', borderRadius: '10px' }} />
                  )}
                  {discount > 0 && <span style={{ position: 'absolute', top: 0, left: 0, background: '#ef4444', color: 'white', fontSize: '8px', fontWeight: 900, padding: '2px 7px', borderRadius: '5px' }}>-{discount}%</span>}
                </div>
                <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600, marginBottom: '3px' }}>{product.brand}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', lineHeight: 1.3, marginBottom: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>{formatPrice(product.price)}</div>
              </Link>
              <button onClick={() => addItem(product)} style={{ width: '100%', background: '#2563eb', color: 'white', fontSize: '10px', fontWeight: 700, padding: '9px', borderRadius: '9px', border: 'none', cursor: 'pointer' }}>
                Add to Cart
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}