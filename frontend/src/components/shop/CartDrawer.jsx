import { Link } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import { formatPrice } from '../../utils/formatters'

export default function CartDrawer() {
  const {
    items, isOpen, closeCart, removeItem,
    updateQuantity, getSubtotal, getItemCount, clearCart
  } = useCartStore()

  const subtotal = getSubtotal()
  const itemCount = getItemCount()

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={closeCart} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-gray-900 font-black text-lg">Your Cart</h2>
            {itemCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-gray-800 font-bold text-lg mb-2">Your cart is empty</h3>
              <p className="text-gray-400 text-sm mb-6">Add products to get started</p>
              <button onClick={closeCart} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-3">
                  <div className="w-16 h-16 shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100 p-1">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="3" width="20" height="14" rx="2"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-xs">{item.brand}</p>
                    <p className="text-gray-800 text-sm font-semibold leading-tight line-clamp-2 mb-1">{item.name}</p>
                    <p className="text-blue-600 font-black text-sm">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button onClick={() => removeItem(item.id)} className="text-gray-200 hover:text-red-400 transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-8 text-center text-gray-800 text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Subtotal ({itemCount} items)</span>
              <span className="text-gray-900 font-black text-lg">{formatPrice(subtotal)}</span>
            </div>

            <p className="text-gray-400 text-xs">Delivery fee calculated at checkout</p>

            <div className="flex items-center gap-2">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1.5">
                <span className="text-yellow-600 text-xs font-bold">MTN MoMo</span>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                <span className="text-red-500 text-xs font-bold">Airtel Money</span>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-black py-4 rounded-xl text-center hover:opacity-90 transition-all duration-200"
            >
              Proceed to Checkout
            </Link>

            <button onClick={clearCart} className="w-full text-gray-300 hover:text-red-400 text-xs text-center transition-colors py-1">
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}