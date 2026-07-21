import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { formatPrice } from '../../utils/formatters'
import useCartStore from '../../store/cartStore'

export default function NewArrivals() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const { addItem } = useCartStore()
  const perPage = 4

  useEffect(() => {
    api.get('/products?isNewArrival=true&limit=20')
      .then(res => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const total = Math.ceil(products.length / perPage)
  const visible = products.slice(page * perPage, (page + 1) * perPage)

  if (loading) return (
    <section>
      <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', marginBottom: '24px' }}>New Arrivals</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ padding: '16px' }}>
            <div style={{ height: '160px', background: '#f1f5f9', borderRadius: '12px', marginBottom: '12px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', marginBottom: '8px', width: '60%' }} />
            <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '6px' }} />
          </div>
        ))}
      </div>
    </section>
  )

  if (products.length === 0) return null

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>New Arrivals</div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Fresh stock just landed</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/products" style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a', textDecoration: 'none' }}>View all →</Link>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{ width: '36px', height: '36px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
            <button onClick={() => setPage(p => Math.min(total - 1, p + 1))} disabled={page >= total - 1} style={{ width: '36px', height: '36px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: page >= total - 1 ? 'not-allowed' : 'pointer', opacity: page >= total - 1 ? 0.4 : 1, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</button>
          </div>
        </div>
      </div>

      {/* Products — no boxes, free in space */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
        {visible.map(product => {
          const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0
          return (
            <div key={product.id} style={{ padding: '16px', cursor: 'pointer', borderRadius: '16px', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Link to={`/product/${product.slug || product.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '14px' }}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))', transition: 'transform 0.3s' }}
                      onMouseEnter={e => e.target.style.transform = 'translateY(-4px)'}
                      onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                    />
                  ) : (
                    <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '12px' }} />
                  )}
                  {discount > 0 && <span style={{ position: 'absolute', top: 0, left: 0, background: '#ef4444', color: 'white', fontSize: '9px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>-{discount}%</span>}
                  {product.isNewArrival && <span style={{ position: 'absolute', top: 0, right: 0, background: '#16a34a', color: 'white', fontSize: '9px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>New</span>}
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>{product.brand}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', lineHeight: 1.4, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}>
                  {formatPrice(product.price)}
                  {product.comparePrice && <span style={{ fontSize: '11px', color: '#cbd5e1', textDecoration: 'line-through', marginLeft: '8px', fontWeight: 400 }}>{formatPrice(product.comparePrice)}</span>}
                </div>
              </Link>
              <button onClick={() => addItem(product)} style={{ width: '100%', background: '#16a34a', color: 'white', fontSize: '11px', fontWeight: 700, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
                Add to Cart
              </button>
            </div>
          )
        })}
      </div>

      {/* Page dots */}
      {total > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)} style={{ border: 'none', cursor: 'pointer', background: i === page ? '#16a34a' : '#e2e8f0', height: '7px', width: i === page ? '24px' : '7px', borderRadius: '4px', transition: 'all 0.3s', padding: 0 }} />
          ))}
        </div>
      )}
    </section>
  )
}