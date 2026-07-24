import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'
import { formatPrice } from '../../utils/formatters'
import Navbar from '../../components/shared/Navbar'

const DELIVERY_AREAS = [
  { name: 'Kampala Central', fee: 5000 },
  { name: 'Nakawa', fee: 7000 },
  { name: 'Makindye', fee: 7000 },
  { name: 'Rubaga', fee: 7000 },
  { name: 'Kawempe', fee: 7000 },
  { name: 'Wakiso', fee: 10000 },
  { name: 'Mukono', fee: 15000 },
  { name: 'Entebbe', fee: 15000 },
  { name: 'Jinja', fee: 25000 },
  { name: 'Outside Kampala', fee: 30000 },
]

const STEPS = ['Delivery', 'Payment', 'Review']

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { items, getSubtotal, clearCart } = useCartStore()
  const { user, token } = useAuthStore()
  const navigate = useNavigate()

  const [delivery, setDelivery] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    area: '',
    notes: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('')
  const [momoNumber, setMomoNumber] = useState('')

  const subtotal = getSubtotal()
  const selectedArea = DELIVERY_AREAS.find(a => a.name === delivery.area)
  const deliveryFee = selectedArea?.fee || 0
  const total = subtotal + deliveryFee

  const handleDeliveryChange = (e) => {
    setDelivery(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePlaceOrder = async () => {
    if (!token) {
      navigate('/login?redirect=/checkout')
      return
    }

    setLoading(true)
    setError('')

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || '',
        })),
        deliveryName: delivery.name,
        deliveryPhone: delivery.phone,
        deliveryAddress: delivery.address,
        deliveryArea: delivery.area,
        deliveryFee,
        paymentMethod,
        notes: delivery.notes,
        momoNumber,
      }

      const res = await fetch('https://prestige-tech-store-api.vercel.app/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to place order')

      clearCart()
      navigate(`/order-confirmation/${data.order.orderNumber}`)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />
        <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>Your cart is empty</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Add some products before checking out</p>
          <Link to="/" style={{ background: '#16a34a', color: 'white', padding: '14px 32px', borderRadius: '14px', textDecoration: 'none', fontWeight: 700 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}>Checkout</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>{items.length} item{items.length > 1 ? 's' : ''} in your cart</p>
        </div>

        {/* Steps indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '0' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step > i + 1 ? '#16a34a' : step === i + 1 ? '#0f172a' : '#e2e8f0',
                  color: step >= i + 1 ? 'white' : '#94a3b8',
                  fontSize: '13px', fontWeight: 900, flexShrink: 0
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: step === i + 1 ? '#0f172a' : '#94a3b8', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: '2px', background: step > i + 1 ? '#16a34a' : '#e2e8f0', margin: '0 12px' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>

          {/* Left — Steps */}
          <div>

            {/* STEP 1 — Delivery */}
            {step === 1 && (
              <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '24px' }}>Delivery Details</h2>

                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                    <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Full Name *</label>
                      <input
                        name="name"
                        value={delivery.name}
                        onChange={handleDeliveryChange}
                        placeholder="Enter your full name"
                        required
                        style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', color: '#0f172a' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Phone Number *</label>
                      <input
                        name="phone"
                        value={delivery.phone}
                        onChange={handleDeliveryChange}
                        placeholder="e.g. 0701234567"
                        required
                        style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', color: '#0f172a' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Delivery Area *</label>
                    <select
                      name="area"
                      value={delivery.area}
                      onChange={handleDeliveryChange}
                      required
                      style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', color: '#0f172a', background: 'white' }}
                    >
                      <option value="">Select your area</option>
                      {DELIVERY_AREAS.map(area => (
                        <option key={area.name} value={area.name}>
                          {area.name} — {formatPrice(area.fee)} delivery
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Delivery Address *</label>
                    <input
                      name="address"
                      value={delivery.address}
                      onChange={handleDeliveryChange}
                      placeholder="Street, building, landmark near you"
                      required
                      style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', color: '#0f172a' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Order Notes (optional)</label>
                    <textarea
                      name="notes"
                      value={delivery.notes}
                      onChange={handleDeliveryChange}
                      placeholder="Any special instructions for delivery..."
                      rows={3}
                      style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', color: '#0f172a', resize: 'none' }}
                    />
                  </div>

                </div>

                <button
                  onClick={() => {
                    if (!delivery.name || !delivery.phone || !delivery.area || !delivery.address) {
                      setError('Please fill in all required fields')
                      return
                    }
                    setError('')
                    setStep(2)
                  }}
                  style={{ width: '100%', background: '#0f172a', color: 'white', fontWeight: 900, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', marginTop: '24px' }}
                >
                  Continue to Payment →
                </button>

              </div>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>Payment Method</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>Choose how you want to pay</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>

                  {/* MTN MoMo */}
                  <div
                    onClick={() => setPaymentMethod('MTN_MOMO')}
                    style={{
                      border: `2px solid ${paymentMethod === 'MTN_MOMO' ? '#eab308' : '#f1f5f9'}`,
                      borderRadius: '16px', padding: '20px', cursor: 'pointer',
                      background: paymentMethod === 'MTN_MOMO' ? '#fefce8' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', background: '#eab308', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: 'white', fontWeight: 900, fontSize: '11px', textAlign: 'center', lineHeight: 1.2 }}>MTN{'\n'}MoMo</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>MTN Mobile Money</div>
                        <div style={{ color: '#64748b', fontSize: '13px' }}>Pay securely with MTN MoMo</div>
                      </div>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === 'MTN_MOMO' ? '#eab308' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {paymentMethod === 'MTN_MOMO' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }} />}
                      </div>
                    </div>

                    {paymentMethod === 'MTN_MOMO' && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #fde68a' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>MTN MoMo Number *</label>
                        <input
                          value={momoNumber}
                          onChange={e => setMomoNumber(e.target.value)}
                          placeholder="e.g. 0771234567"
                          style={{ width: '100%', border: '1px solid #fde68a', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', color: '#0f172a', background: 'white' }}
                        />
                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                          You will receive a payment prompt on this number
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Airtel Money */}
                  <div
                    onClick={() => setPaymentMethod('AIRTEL_MONEY')}
                    style={{
                      border: `2px solid ${paymentMethod === 'AIRTEL_MONEY' ? '#ef4444' : '#f1f5f9'}`,
                      borderRadius: '16px', padding: '20px', cursor: 'pointer',
                      background: paymentMethod === 'AIRTEL_MONEY' ? '#fef2f2' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', background: '#ef4444', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: 'white', fontWeight: 900, fontSize: '11px', textAlign: 'center', lineHeight: 1.2 }}>Airtel{'\n'}Money</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>Airtel Money</div>
                        <div style={{ color: '#64748b', fontSize: '13px' }}>Pay securely with Airtel Money</div>
                      </div>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === 'AIRTEL_MONEY' ? '#ef4444' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {paymentMethod === 'AIRTEL_MONEY' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />}
                      </div>
                    </div>

                    {paymentMethod === 'AIRTEL_MONEY' && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #fecaca' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Airtel Money Number *</label>
                        <input
                          value={momoNumber}
                          onChange={e => setMomoNumber(e.target.value)}
                          placeholder="e.g. 0701234567"
                          style={{ width: '100%', border: '1px solid #fecaca', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', color: '#0f172a', background: 'white' }}
                        />
                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                          You will receive a payment prompt on this number
                        </p>
                      </div>
                    )}
                  </div>

                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{ flex: 1, background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 700, padding: '14px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px' }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => {
                      if (!paymentMethod) {
                        setError('Please select a payment method')
                        return
                      }
                      if (!momoNumber) {
                        setError('Please enter your mobile money number')
                        return
                      }
                      setError('')
                      setStep(3)
                    }}
                    style={{ flex: 2, background: '#0f172a', color: 'white', fontWeight: 900, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px' }}
                  >
                    Review Order →
                  </button>
                </div>

                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', marginTop: '12px' }}>
                    <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>
                  </div>
                )}

              </div>
            )}

            {/* STEP 3 — Review */}
            {step === 3 && (
              <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '24px' }}>Review Your Order</h2>

                {/* Delivery summary */}
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Delivery Details</span>
                    <button onClick={() => setStep(1)} style={{ fontSize: '12px', color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '2px' }}>{delivery.name} · {delivery.phone}</p>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '2px' }}>{delivery.address}</p>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>{delivery.area}</p>
                </div>

                {/* Payment summary */}
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Payment Method</span>
                    <button onClick={() => setStep(2)} style={{ fontSize: '12px', color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    {paymentMethod === 'MTN_MOMO' ? 'MTN Mobile Money' : 'Airtel Money'} · {momoNumber}
                  </p>
                </div>

                {/* Items */}
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Items ({items.length})</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {items.map(item => (
                      <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', background: '#f8fafc', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                          {item.images?.[0] && <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>{item.name}</p>
                          <p style={{ fontSize: '12px', color: '#94a3b8' }}>Qty: {item.quantity}</p>
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', flexShrink: 0 }}>{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                    <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setStep(2)}
                    style={{ flex: 1, background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 700, padding: '14px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px' }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    style={{ flex: 2, background: 'linear-gradient(135deg, #16a34a, #2563eb)', color: 'white', fontWeight: 900, padding: '14px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Placing Order...' : `Place Order · ${formatPrice(total)}`}
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Right — Order Summary */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginBottom: '20px' }}>Order Summary</h3>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '280px', overflowY: 'auto' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    {item.images?.[0] && <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#0f172a', color: 'white', fontSize: '9px', fontWeight: 900, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.quantity}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.name}</p>
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', flexShrink: 0 }}>{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Subtotal</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Delivery ({delivery.area || 'not selected'})</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: deliveryFee > 0 ? '#0f172a' : '#94a3b8' }}>
                  {deliveryFee > 0 ? formatPrice(deliveryFee) : 'Select area'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>Total</span>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#16a34a' }}>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Payment badges */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: '8px', padding: '6px 10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#ca8a04' }}>MTN MoMo</span>
              </div>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '6px 10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626' }}>Airtel Money</span>
              </div>
            </div>

            {/* Security note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Secured checkout — your data is safe</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}