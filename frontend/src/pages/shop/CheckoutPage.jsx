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
    if (!token) { navigate('/login?redirect=/checkout'); return }
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(orderData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to place order')
      clearCart()
      navigate('/order-confirmation/' + data.order.orderNumber)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Input style reused throughout
  const inputStyle = {
    width: '100%', border: '2px solid #bfdbfe',
    borderRadius: '10px', padding: '11px 14px',
    fontSize: '14px', outline: 'none', color: '#0f172a',
    background: 'white', fontFamily: 'inherit'
  }

  const labelStyle = {
    display: 'block', fontSize: '12px',
    fontWeight: 700, color: '#1d4ed8', marginBottom: '6px'
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
        <Navbar />
        <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '24px' }}>
          <div style={{ width: '80px', height: '80px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>Your cart is empty</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Add some products before checking out</p>
          <Link to="/" style={{ background: '#16a34a', color: 'white', padding: '14px 32px', borderRadius: '14px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}>Checkout</h1>
          <p style={{ color: '#1d4ed8', fontSize: '14px', fontWeight: 600 }}>{items.length} item{items.length > 1 ? 's' : ''} in your cart</p>
        </div>

        {/* Steps indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step > i + 1 ? '#16a34a' : step === i + 1 ? '#16a34a' : '#bfdbfe',
                  color: step >= i + 1 ? 'white' : '#1d4ed8',
                  fontSize: '13px', fontWeight: 900, flexShrink: 0
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: step === i + 1 ? '#16a34a' : '#94a3b8', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: '2px', background: step > i + 1 ? '#16a34a' : '#bfdbfe', margin: '0 12px' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>

          {/* Left — Steps */}
          <div>

            {/* STEP 1 — Delivery */}
            {step === 1 && (
              <div style={{ background: 'white', borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden' }}>

                {/* Step header */}
                <div style={{ background: '#16a34a', padding: '18px 24px' }}>
                  <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'white' }}>Delivery Details</h2>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>Where should we deliver your order?</p>
                </div>

                <div style={{ padding: '24px' }}>
                  {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                      <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Full Name *</label>
                        <input name="name" value={delivery.name} onChange={handleDeliveryChange} placeholder="Your full name" required style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Phone Number *</label>
                        <input name="phone" value={delivery.phone} onChange={handleDeliveryChange} placeholder="e.g. 0701234567" required style={inputStyle} />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Delivery Area *</label>
                      <select name="area" value={delivery.area} onChange={handleDeliveryChange} required style={inputStyle}>
                        <option value="">Select your area</option>
                        {DELIVERY_AREAS.map(area => (
                          <option key={area.name} value={area.name}>
                            {area.name} — {formatPrice(area.fee)} delivery
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Delivery Address *</label>
                      <input name="address" value={delivery.address} onChange={handleDeliveryChange} placeholder="Street, building, landmark near you" required style={inputStyle} />
                    </div>

                    <div>
                      <label style={labelStyle}>Order Notes (optional)</label>
                      <textarea name="notes" value={delivery.notes} onChange={handleDeliveryChange} placeholder="Any special instructions..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
                    </div>
                  </div>

                  {/* Light blue info box */}
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '12px 16px', marginTop: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4M12 8h.01"/>
                    </svg>
                    <p style={{ fontSize: '12px', color: '#1d4ed8', fontWeight: 600 }}>We deliver Monday to Saturday, 8am to 8pm across greater Kampala</p>
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
                    style={{ width: '100%', background: '#16a34a', color: 'white', fontWeight: 800, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', marginTop: '20px' }}
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <div style={{ background: 'white', borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden' }}>

                <div style={{ background: '#16a34a', padding: '18px 24px' }}>
                  <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'white' }}>Payment Method</h2>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>Choose how you want to pay</p>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  {/* MTN MoMo */}
                  <div
                    onClick={() => setPaymentMethod('MTN_MOMO')}
                    style={{
                      border: `2px solid ${paymentMethod === 'MTN_MOMO' ? '#16a34a' : '#bfdbfe'}`,
                      borderRadius: '16px', padding: '18px', cursor: 'pointer',
                      background: paymentMethod === 'MTN_MOMO' ? '#f0fdf4' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '48px', height: '48px', background: '#eab308', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: 'white', fontWeight: 900, fontSize: '10px', textAlign: 'center', lineHeight: 1.3 }}>MTN{'\n'}MoMo</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>MTN Mobile Money</div>
                        <div style={{ color: '#64748b', fontSize: '12px' }}>Pay securely with MTN MoMo</div>
                      </div>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === 'MTN_MOMO' ? '#16a34a' : '#bfdbfe'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {paymentMethod === 'MTN_MOMO' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }} />}
                      </div>
                    </div>
                    {paymentMethod === 'MTN_MOMO' && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #bbf7d0' }}>
                        <label style={labelStyle}>MTN MoMo Number *</label>
                        <input value={momoNumber} onChange={e => setMomoNumber(e.target.value)} placeholder="e.g. 0771234567" style={inputStyle} />
                        <p style={{ fontSize: '12px', color: '#1d4ed8', marginTop: '8px', fontWeight: 600 }}>You will receive a payment prompt on this number</p>
                      </div>
                    )}
                  </div>

                  {/* Airtel Money */}
                  <div
                    onClick={() => setPaymentMethod('AIRTEL_MONEY')}
                    style={{
                      border: `2px solid ${paymentMethod === 'AIRTEL_MONEY' ? '#16a34a' : '#bfdbfe'}`,
                      borderRadius: '16px', padding: '18px', cursor: 'pointer',
                      background: paymentMethod === 'AIRTEL_MONEY' ? '#f0fdf4' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '48px', height: '48px', background: '#ef4444', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: 'white', fontWeight: 900, fontSize: '10px', textAlign: 'center', lineHeight: 1.3 }}>Airtel{'\n'}Money</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>Airtel Money</div>
                        <div style={{ color: '#64748b', fontSize: '12px' }}>Pay securely with Airtel Money</div>
                      </div>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === 'AIRTEL_MONEY' ? '#16a34a' : '#bfdbfe'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {paymentMethod === 'AIRTEL_MONEY' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }} />}
                      </div>
                    </div>
                    {paymentMethod === 'AIRTEL_MONEY' && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #bbf7d0' }}>
                        <label style={labelStyle}>Airtel Money Number *</label>
                        <input value={momoNumber} onChange={e => setMomoNumber(e.target.value)} placeholder="e.g. 0701234567" style={inputStyle} />
                        <p style={{ fontSize: '12px', color: '#1d4ed8', marginTop: '8px', fontWeight: 600 }}>You will receive a payment prompt on this number</p>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px' }}>
                      <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button onClick={() => setStep(1)} style={{ flex: 1, background: '#eff6ff', border: '2px solid #bfdbfe', color: '#1d4ed8', fontWeight: 700, padding: '13px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px' }}>
                      ← Back
                    </button>
                    <button
                      onClick={() => {
                        if (!paymentMethod) { setError('Please select a payment method'); return }
                        if (!momoNumber) { setError('Please enter your mobile money number'); return }
                        setError('')
                        setStep(3)
                      }}
                      style={{ flex: 2, background: '#16a34a', color: 'white', fontWeight: 800, padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px' }}
                    >
                      Review Order →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — Review */}
            {step === 3 && (
              <div style={{ background: 'white', borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden' }}>

                <div style={{ background: '#16a34a', padding: '18px 24px' }}>
                  <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'white' }}>Review Your Order</h2>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>Confirm everything looks correct</p>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {/* Delivery summary */}
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1d4ed8' }}>Delivery Details</span>
                      <button onClick={() => setStep(1)} style={{ fontSize: '12px', color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Edit</button>
                    </div>
                    <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>{delivery.name} · {delivery.phone}</p>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>{delivery.address}, {delivery.area}</p>
                  </div>

                  {/* Payment summary */}
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1d4ed8' }}>Payment Method</span>
                      <button onClick={() => setStep(2)} style={{ fontSize: '12px', color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Edit</button>
                    </div>
                    <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                      {paymentMethod === 'MTN_MOMO' ? 'MTN Mobile Money' : 'Airtel Money'} · {momoNumber}
                    </p>
                  </div>

                  {/* Items */}
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#1d4ed8', marginBottom: '12px' }}>Items ({items.length})</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {items.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, border: '1px solid #bfdbfe' }}>
                            {item.images?.[0] && <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>{item.name}</p>
                            <p style={{ fontSize: '12px', color: '#64748b' }}>Qty: {item.quantity}</p>
                          </div>
                          <p style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a', flexShrink: 0 }}>{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px' }}>
                      <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setStep(2)} style={{ flex: 1, background: '#eff6ff', border: '2px solid #bfdbfe', color: '#1d4ed8', fontWeight: 700, padding: '13px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px' }}>
                      ← Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      style={{ flex: 2, background: loading ? '#64748b' : '#16a34a', color: 'white', fontWeight: 800, padding: '13px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px' }}
                    >
                      {loading ? 'Placing Order...' : `Place Order · ${formatPrice(total)}`}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div style={{ position: 'sticky', top: '100px', borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden' }}>

            {/* Green header */}
            <div style={{ background: '#16a34a', padding: '16px 20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>Order Summary</h3>
            </div>

            {/* Items — light blue bg */}
            <div style={{ background: '#eff6ff', padding: '16px 20px', maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, position: 'relative', border: '1px solid #bfdbfe' }}>
                    {item.images?.[0] && <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#16a34a', color: 'white', fontSize: '9px', fontWeight: 900, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.quantity}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</p>
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', flexShrink: 0 }}>{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Subtotals — white */}
            <div style={{ background: 'white', padding: '14px 20px', borderTop: '1px solid #bfdbfe', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Subtotal</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Delivery ({delivery.area || 'not selected'})</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: deliveryFee > 0 ? '#0f172a' : '#16a34a' }}>
                  {deliveryFee > 0 ? formatPrice(deliveryFee) : 'Select area'}
                </span>
              </div>
            </div>

            {/* Green total */}
            <div style={{ background: '#16a34a', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: 'white' }}>Total</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: 'white' }}>{formatPrice(total)}</span>
            </div>

            {/* Payment badges */}
            <div style={{ background: '#eff6ff', padding: '12px 20px', display: 'flex', gap: '8px', borderTop: '1px solid #bfdbfe' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: '#fefce8', color: '#a16207', border: '1px solid #fde68a' }}>MTN MoMo</span>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>Airtel Money</span>
            </div>

            {/* Security badge */}
            <div style={{ background: '#eff6ff', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', borderTop: '1px solid #bfdbfe' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600 }}>Secured checkout — your data is safe</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}