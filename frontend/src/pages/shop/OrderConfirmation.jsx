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
    fetch('https://prestige-tech-store-api.vercel.app/api/orders/' + orderNumber, {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => setOrder(data.order))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [orderNumber])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
        <Navbar />
        <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '24px' }}>
          <p style={{ color: '#1d4ed8', fontWeight: 600 }}>Loading your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      <Navbar />

      <div style={{ maxWidth: '620px', margin: '40px auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Success card */}
        <div style={{ borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden' }}>

          {/* Green header */}
          <div style={{ background: '#16a34a', padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: 'white', marginBottom: '6px' }}>Order Placed!</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
              Thank you. We will contact you shortly to confirm delivery.
            </p>
          </div>

          {/* Light blue order number */}
          <div style={{ background: '#eff6ff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bfdbfe' }}>
            <span style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: 600 }}>Order Number</span>
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>{orderNumber}</span>
          </div>

          {/* White order details */}
          {order && (
            <div style={{ background: 'white', padding: '20px 24px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#1d4ed8', marginBottom: '14px' }}>Items Ordered</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {order.items?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{item.name}</p>
                      <p style={{ fontSize: '12px', color: '#64748b' }}>Qty: {item.quantity}</p>
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Subtotals */}
              <div style={{ borderTop: '1px solid #bfdbfe', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Subtotal</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{formatPrice(order.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Delivery</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{formatPrice(order.deliveryFee)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Green total */}
          <div style={{ background: '#16a34a', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'white' }}>Total Paid</span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: 'white' }}>{order ? formatPrice(order.total) : '—'}</span>
          </div>

        </div>

        {/* Delivery info */}
        {order && (
          <div style={{ borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden' }}>
            <div style={{ background: '#16a34a', padding: '14px 20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'white' }}>Delivery Information</h2>
            </div>
            <div style={{ background: '#eff6ff', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{ fontSize: '13px', color: '#0f172a' }}><span style={{ fontWeight: 700, color: '#1d4ed8' }}>Name:</span> {order.deliveryName}</p>
              <p style={{ fontSize: '13px', color: '#0f172a' }}><span style={{ fontWeight: 700, color: '#1d4ed8' }}>Phone:</span> {order.deliveryPhone}</p>
              <p style={{ fontSize: '13px', color: '#0f172a' }}><span style={{ fontWeight: 700, color: '#1d4ed8' }}>Address:</span> {order.deliveryAddress}</p>
              <p style={{ fontSize: '13px', color: '#0f172a' }}><span style={{ fontWeight: 700, color: '#1d4ed8' }}>Area:</span> {order.deliveryArea}</p>
            </div>
          </div>
        )}

        {/* WhatsApp */}
        <div style={{ borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden' }}>
          <div style={{ background: '#16a34a', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Questions about your order?</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>Chat with us on WhatsApp</p>
            </div>
            
              href={'https://wa.me/256704068865?text=Hi! I just placed order ' + orderNumber + '. Can you confirm my delivery?'}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'white', color: '#15803d', padding: '10px 18px', borderRadius: '12px', textDecoration: 'none', fontWeight: 800, fontSize: '13px' }}
            <a>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#15803d">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.524 3.655 1.435 5.163L2 22l4.837-1.435A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
              Chat Now
            </a>
          </div>

          {/* Light blue security */}
          <div style={{ background: '#eff6ff', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600 }}>Your order is confirmed and secured</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/account/orders" style={{ flex: 1, background: '#eff6ff', border: '2px solid #bfdbfe', color: '#1d4ed8', padding: '14px', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
            View My Orders
          </Link>
          <Link to="/" style={{ flex: 1, background: '#16a34a', color: 'white', padding: '14px', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: 800, fontSize: '14px' }}>
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  )
}