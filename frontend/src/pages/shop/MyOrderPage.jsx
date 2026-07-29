import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { formatPrice } from '../../utils/formatters'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'

const STATUS_COLORS = {
  PENDING: { bg: '#fefce8', color: '#a16207', border: '#fde68a', label: 'Pending' },
  CONFIRMED: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'Confirmed' },
  PROCESSING: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'Processing' },
  SHIPPED: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', label: 'Shipped' },
  DELIVERED: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', label: 'Delivered' },
  CANCELLED: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', label: 'Cancelled' },
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/account/orders')
      return
    }
    fetch('https://prestige-tech-store-api.vercel.app/api/orders/my-orders', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => setOrders(data.orders || []))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      <Navbar />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}>My Orders</h1>
          <p style={{ fontSize: '14px', color: '#1d4ed8', fontWeight: 600 }}>Track and manage your orders</p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '16px', border: '2px solid #bfdbfe', height: '120px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div style={{ borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden', textAlign: 'center' }}>
            <div style={{ background: '#16a34a', padding: '20px 24px' }}>
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>No Orders Yet</p>
            </div>
            <div style={{ background: 'white', padding: '48px 24px' }}>
              <div style={{ width: '72px', height: '72px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>You have not placed any orders yet</h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Start shopping and your orders will appear here</p>
              <Link to="/" style={{ background: '#16a34a', color: 'white', padding: '12px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
                Start Shopping
              </Link>
            </div>
            <div style={{ background: '#eff6ff', borderTop: '2px solid #bfdbfe', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600 }}>All orders are secured and tracked</span>
            </div>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map(order => {
              const status = STATUS_COLORS[order.status] || STATUS_COLORS.PENDING
              return (
                <div key={order.id} style={{ borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden' }}>

                  {/* Green order header */}
                  <div style={{ background: '#16a34a', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>Order #{order.orderNumber}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-UG', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <span style={{ background: status.bg, color: status.color, border: '1px solid ' + status.border, fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>
                      {status.label}
                    </span>
                  </div>

                  {/* Items */}
                  <div style={{ background: 'white', padding: '16px 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                      {order.items?.slice(0, 3).map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <div style={{ width: '44px', height: '44px', background: '#eff6ff', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.image ? (
                              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px' }} />
                            ) : (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                                <rect x="2" y="3" width="20" height="14" rx="2"/>
                              </svg>
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>{item.name}</p>
                            <p style={{ fontSize: '12px', color: '#64748b' }}>Qty: {item.quantity} · {formatPrice(item.price)}</p>
                          </div>
                          <p style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a', flexShrink: 0 }}>{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                          +{order.items.length - 3} more items
                        </p>
                      )}
                    </div>

                    {/* Delivery info */}
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" style={{ marginTop: '1px', flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: '#1d4ed8' }}>{order.deliveryArea}</p>
                        <p style={{ fontSize: '11px', color: '#64748b' }}>{order.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Light blue subtotals */}
                  <div style={{ background: '#eff6ff', borderTop: '1px solid #bfdbfe', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#64748b' }}>Payment</p>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                          {order.paymentMethod === 'MTN_MOMO' ? 'MTN MoMo' : 'Airtel Money'}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#64748b' }}>Delivery fee</p>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{formatPrice(order.deliveryFee)}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '11px', color: '#64748b' }}>Total</p>
                      <p style={{ fontSize: '16px', fontWeight: 900, color: '#16a34a' }}>{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  {/* Green footer actions */}
                  <div style={{ background: '#16a34a', padding: '12px 20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    
                      href={'https://wa.me/256704068865?text=Hi! I have a question about order ' + order.orderNumber}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 14px', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}
                    <a>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.524 3.655 1.435 5.163L2 22l4.837-1.435A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                      </svg>
                      WhatsApp
                    </a>
                    <Link
                      to={'/order-confirmation/' + order.orderNumber}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'white', color: '#15803d', padding: '8px 14px', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: 700 }}
                    >
                      View Details →
                    </Link>
                  </div>

                </div>
              )
            })}
          </div>
        )}

      </div>

      <Footer />
    </div>
  )
}