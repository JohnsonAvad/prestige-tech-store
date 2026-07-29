import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatPrice } from '../../utils/formatters'

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const STATUS_COLORS = {
  PENDING: { bg: '#fefce8', color: '#a16207', border: '#fde68a', label: 'Pending' },
  CONFIRMED: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'Confirmed' },
  PROCESSING: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'Processing' },
  SHIPPED: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', label: 'Shipped' },
  DELIVERED: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', label: 'Delivered' },
  CANCELLED: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', label: 'Cancelled' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [updating, setUpdating] = useState(null)
  const navigate = useNavigate()
  const token = localStorage.getItem('admin_token')

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return }
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://prestige-tech-store-api.vercel.app/api/orders', {
        headers: { Authorization: 'Bearer ' + token }
      })
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await fetch('https://prestige-tech-store-api.vercel.app/api/orders/' + orderId + '/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ status })
      })
      fetchOrders()
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    revenue: orders.filter(o => o.status !== 'CANCELLED').reduce((sum, o) => sum + o.total, 0)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>

      {/* Header */}
      <div style={{ background: '#16a34a', padding: '0 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/admin/dashboard" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 900, color: 'white' }}>Orders</h1>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{orders.length} total orders</p>
            </div>
          </div>
          <button
            onClick={fetchOrders}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total Orders', value: stats.total, color: '#16a34a' },
            { label: 'Pending', value: stats.pending, color: '#a16207' },
            { label: 'Confirmed', value: stats.confirmed, color: '#1d4ed8' },
            { label: 'Delivered', value: stats.delivered, color: '#15803d' },
            { label: 'Total Revenue', value: formatPrice(stats.revenue), color: '#16a34a', small: true },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', border: '2px solid #bfdbfe', overflow: 'hidden' }}>
              <div style={{ background: '#16a34a', padding: '8px 14px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{stat.label}</p>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <p style={{ fontSize: stat.small ? '14px' : '24px', fontWeight: 900, color: stat.color }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['ALL', ...STATUS_OPTIONS].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '7px 14px', borderRadius: '20px', border: '2px solid',
                borderColor: filter === s ? '#16a34a' : '#bfdbfe',
                background: filter === s ? '#16a34a' : 'white',
                color: filter === s ? 'white' : '#1d4ed8',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              {s === 'ALL' ? 'All Orders' : STATUS_COLORS[s]?.label}
              {s !== 'ALL' && (
                <span style={{ marginLeft: '6px', background: filter === s ? 'rgba(255,255,255,0.3)' : '#eff6ff', padding: '1px 6px', borderRadius: '10px', fontSize: '11px' }}>
                  {orders.filter(o => o.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '16px', border: '2px solid #bfdbfe', height: '160px' }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div style={{ background: 'white', borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden', textAlign: 'center' }}>
            <div style={{ background: '#16a34a', padding: '16px 24px' }}>
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>No Orders Found</p>
            </div>
            <div style={{ padding: '48px 24px' }}>
              <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>No orders yet</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Orders will appear here when customers place them</p>
            </div>
            <div style={{ background: '#eff6ff', borderTop: '2px solid #bfdbfe', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600 }}>All orders are secured and tracked</span>
            </div>
          </div>
        )}

        {/* Orders list */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map(order => {
              const status = STATUS_COLORS[order.status] || STATUS_COLORS.PENDING
              return (
                <div key={order.id} style={{ borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden' }}>

                  {/* Green order header */}
                  <div style={{ background: '#16a34a', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>#{order.orderNumber}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-UG', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ background: status.bg, color: status.color, border: '1px solid ' + status.border, fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>
                        {status.label}
                      </span>
                      <p style={{ fontSize: '16px', fontWeight: 900, color: 'white' }}>{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  {/* Customer and items */}
                  <div style={{ background: 'white', padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                    {/* Customer info */}
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1d4ed8', marginBottom: '8px' }}>Customer</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>{order.deliveryName}</p>
                      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '2px' }}>{order.deliveryPhone}</p>
                      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>{order.deliveryAddress}</p>
                      <p style={{ fontSize: '12px', color: '#1d4ed8', fontWeight: 600 }}>{order.deliveryArea}</p>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: order.paymentMethod === 'MTN_MOMO' ? '#fefce8' : '#fef2f2', color: order.paymentMethod === 'MTN_MOMO' ? '#a16207' : '#b91c1c', border: '1px solid ' + (order.paymentMethod === 'MTN_MOMO' ? '#fde68a' : '#fecaca') }}>
                          {order.paymentMethod === 'MTN_MOMO' ? 'MTN MoMo' : 'Airtel Money'}
                        </span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1d4ed8', marginBottom: '8px' }}>Items ({order.items?.length})</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {order.items?.slice(0, 3).map((item, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontSize: '12px', color: '#0f172a', flex: 1, marginRight: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              {item.quantity}× {item.name}
                            </p>
                            <p style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', flexShrink: 0 }}>{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <p style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>+{order.items.length - 3} more items</p>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Light blue subtotals */}
                  <div style={{ background: '#eff6ff', borderTop: '1px solid #bfdbfe', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#64748b' }}>Subtotal</p>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{formatPrice(order.subtotal)}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#64748b' }}>Delivery</p>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{formatPrice(order.deliveryFee)}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#64748b' }}>Total</p>
                        <p style={{ fontSize: '14px', fontWeight: 900, color: '#16a34a' }}>{formatPrice(order.total)}</p>
                      </div>
                    </div>

                    {/* Update status */}
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      disabled={updating === order.id}
                      style={{ border: '2px solid #bfdbfe', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', fontWeight: 700, color: '#1d4ed8', background: 'white', cursor: 'pointer', outline: 'none' }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{STATUS_COLORS[s]?.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Green footer actions */}
                  <div style={{ background: '#16a34a', padding: '12px 20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    
                      href={'https://wa.me/' + order.deliveryPhone?.replace(/^0/, '256') + '?text=Hi ' + order.deliveryName + '! Your order ' + order.orderNumber + ' has been ' + status.label.toLowerCase() + '.'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 14px', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}
                    <a>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.524 3.655 1.435 5.163L2 22l4.837-1.435A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                      </svg>
                      WhatsApp Customer
                    </a>
                    {order.notes && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 14px', borderRadius: '10px', fontSize: '12px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Note: {order.notes}
                      </div>
                    )}
                  </div>

                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}