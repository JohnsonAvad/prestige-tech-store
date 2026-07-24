import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { formatPrice } from '../../utils/formatters'
import Navbar from '../../components/shared/Navbar'

export default function OrderConfirmation() {
  const { orderNumber } = useParams()
  const { token } = useAuthStore()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderNumber || !token) return
    fetch(`https://prestige-tech-store-api.vercel.app/api/orders/${orderNumber}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOrder(data.order))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [orderNumber])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />
        <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '24px' }}>
          <p style={{ color: '#64748b' }}>Loading your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px' }}>

        {/* Success header */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', textAlign: 'center', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
          <div style={{ width: '72px', height: '72px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>Order Placed!</h1>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '16px' }}>
            Thank you for your order. We will contact you shortly to confirm delivery.
          </p>
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px 20px', display: 'inline-block' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Order Number: </span>
            <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>{orderNumber}</span>
          </div>
        </div>

        {/* Order details */}
        {order && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginBottom: '16px' }}>Order Details</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Subtotal</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{formatPrice(order.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Delivery</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{formatPrice(order.deliveryFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>Total Paid</span>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#16a34a' }}>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Delivery info */}
        {order && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginBottom: '16px' }}>Delivery Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{ fontSize: '13px', color: '#64748b' }}><span style={{ fontWeight: 600, color: '#0f172a' }}>Name:</span> {order.deliveryName}</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}><span style={{ fontWeight: 600, color: '#0f172a' }}>Phone:</span> {order.deliveryPhone}</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}><span style={{ fontWeight: 600, color: '#0f172a' }}>Address:</span> {order.deliveryAddress}</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}><span style={{ fontWeight: 600, color: '#0f172a' }}>Area:</span> {order.deliveryArea}</p>
            </div>
          </div>
        )}

        {/* WhatsApp contact */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '20px', padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#166534', fontWeight: 600, marginBottom: '12px' }}>
            Have questions about your order?
          </p>
          
            href={`https://wa.me/256704068865?text=Hi! I just placed order ${orderNumber}. Can you confirm my delivery?`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}
          <a>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.524 3.655 1.435 5.163L2 22l4.837-1.435A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/account/orders" style={{ flex: 1, background: 'white', border: '1px solid #e2e8f0', color: '#64748b', padding: '14px', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
            View My Orders
          </Link>
          <Link to="/" style={{ flex: 1, background: '#0f172a', color: 'white', padding: '14px', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  )
}