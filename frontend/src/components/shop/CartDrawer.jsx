import { Link } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import { formatPrice } from '../../utils/formatters'

const FREE_DELIVERY_THRESHOLD = 200000

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getItemCount,
    clearCart
  } = useCartStore()

  const subtotal = getSubtotal()
  const itemCount = getItemCount()
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)

  if (!isOpen) return null

  return (
    <>
      {/* Overlay — light not dark */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(148,163,184,0.2)',
          zIndex: 40
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0,
        width: '400px', maxWidth: '100vw',
        display: 'flex', flexDirection: 'column',
        zIndex: 50, boxShadow: '-4px 0 24px rgba(0,0,0,0.08)'
      }}>

        {/* GREEN HEADER */}
        <div style={{
          background: '#16a34a', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'white' }}>Your cart</span>
            {itemCount > 0 && (
              <span style={{
                background: 'white', color: '#15803d',
                fontSize: '11px', fontWeight: 800,
                padding: '2px 9px', borderRadius: '20px'
              }}>{itemCount}</span>
            )}
          </div>
          <button
            onClick={closeCart}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* LIGHT BLUE DELIVERY ALERT */}
        <div style={{
          background: '#eff6ff',
          borderBottom: '2px solid #bfdbfe',
          padding: '11px 24px',
          display: 'flex', alignItems: 'center', gap: '10px',
          flexShrink: 0
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-1 11l2 2 4-4M13 17h8" />
          </svg>
          <span style={{ fontSize: '12px', color: '#1d4ed8', fontWeight: 600, flex: 1 }}>
            {remaining > 0
              ? `Add ${formatPrice(remaining)} more for free delivery in Kampala`
              : 'You qualify for free delivery in Kampala!'
            }
          </span>
          <div style={{
            width: '64px', height: '5px',
            background: '#bfdbfe', borderRadius: '3px',
            overflow: 'hidden', flexShrink: 0
          }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: '#2563eb', borderRadius: '3px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* GREEN ITEMS SECTION */}
        <div style={{
          flex: 1, overflowY: 'auto',
          background: '#16a34a',
          padding: items.length === 0 ? '0' : '16px 20px',
          display: 'flex', flexDirection: 'column', gap: '10px'
        }}>
          {items.length === 0 ? (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', padding: '48px 24px',
              background: '#16a34a'
            }}>
              <div style={{
                width: '72px', height: '72px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                Your cart is empty
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
                Add products to get started
              </p>
              <button
                onClick={closeCart}
                style={{
                  background: 'white', color: '#15803d',
                  fontWeight: 700, fontSize: '14px',
                  padding: '12px 28px', borderRadius: '12px',
                  border: 'none', cursor: 'pointer'
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map(item => {
              const discount = item.comparePrice
                ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)
                : 0
              return (
                <div key={item.id} style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  padding: '14px',
                  background: 'rgba(255,255,255,0.13)',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.22)'
                }}>
                  {/* Image */}
                  <div style={{
                    width: '64px', height: '64px', flexShrink: 0,
                    background: 'white', borderRadius: '10px',
                    overflow: 'hidden', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                        <rect x="2" y="3" width="20" height="14" rx="2"/>
                      </svg>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {item.brand}
                    </p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'white', lineHeight: 1.4, marginBottom: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>
                        {formatPrice(item.price)}
                      </span>
                      {item.comparePrice && (
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textDecoration: 'line-through' }}>
                          {formatPrice(item.comparePrice)}
                        </span>
                      )}
                      {discount > 0 && (
                        <span style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(255,255,255,0.2)', color: 'white', padding: '1px 6px', borderRadius: '4px' }}>
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', flexShrink: 0 }}>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.25)',
                        background: 'rgba(255,255,255,0.1)',
                        cursor: 'pointer', color: 'rgba(255,255,255,0.75)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '8px', overflow: 'hidden'
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer', color: 'white', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >−</button>
                      <span style={{ width: '28px', textAlign: 'center', fontSize: '13px', fontWeight: 700, color: 'white' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer', color: 'white', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >+</button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Only show footer when items exist */}
        {items.length > 0 && (
          <>
            {/* LIGHT BLUE SUBTOTALS */}
            <div style={{
              background: '#eff6ff',
              borderTop: '2px solid #bfdbfe',
              padding: '14px 20px',
              display: 'flex', flexDirection: 'column', gap: '8px',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#1e40af' }}>Subtotal ({itemCount} items)</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#1e40af' }}>Delivery</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: subtotal >= FREE_DELIVERY_THRESHOLD ? '#15803d' : '#0f172a' }}>
                  {subtotal >= FREE_DELIVERY_THRESHOLD ? 'Free in Kampala' : 'Calculated at checkout'}
                </span>
              </div>
            </div>

            {/* GREEN FOOTER — total + actions */}
            <div style={{
              background: '#16a34a',
              padding: '18px 20px',
              display: 'flex', flexDirection: 'column', gap: '12px',
              flexShrink: 0
            }}>
              {/* Grand total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>Total</span>
                <span style={{ fontSize: '22px', fontWeight: 800, color: 'white' }}>{formatPrice(subtotal)}</span>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.25)' }} />

              {/* Payment methods */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '5px 12px', borderRadius: '8px', background: 'rgba(234,179,8,0.2)', color: '#fef08a', border: '1px solid rgba(234,179,8,0.5)' }}>MTN MoMo</span>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '5px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.5)' }}>Airtel Money</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginLeft: '2px' }}>accepted</span>
              </div>

              {/* Checkout button */}
              <Link
                to="/checkout"
                onClick={closeCart}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: 'white', color: '#15803d',
                  fontSize: '15px', fontWeight: 800,
                  padding: '15px', borderRadius: '14px',
                  textDecoration: 'none', border: 'none'
                }}
              >
                Proceed to checkout
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              {/* Continue shopping */}
              <button
                onClick={closeCart}
                style={{
                  width: '100%', padding: '11px', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Continue shopping
              </button>

              {/* Clear cart */}
              <button
                onClick={clearCart}
                style={{
                  background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '11px', cursor: 'pointer', textAlign: 'center'
                }}
              >
                Clear cart
              </button>

              {/* LIGHT BLUE SECURITY BADGE — matches delivery bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                justifyContent: 'center',
                background: '#eff6ff', borderRadius: '10px',
                padding: '10px 14px', border: '1px solid #bfdbfe'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600 }}>
                  Secured checkout — your data is safe
                </span>
              </div>

            </div>
          </>
        )}

      </div>
    </>
  )
}