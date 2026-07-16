import { Link } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import { formatPrice } from '../../utils/formatters'

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

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-950 border-l border-white/10 z-50 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <h2 className="text-white font-black text-lg">Your Cart</h2>
            {itemCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-6xl mb-4">🛒</span>
              <h3 className="text-white font-bold text-lg mb-2">Your cart is empty</h3>
              <p className="text-white/40 text-sm mb-6">
                Add products to your cart to get started
              </p>
              <button
                onClick={closeCart}
                className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-500 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">

                  {/* Image */}
                  <div className="w-16 h-16 shrink-0 bg-white/5 rounded-xl overflow-hidden">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white/40 text-xs">{item.brand}</p>
                    <p className="text-white text-sm font-semibold leading-tight line-clamp-2 mb-1">
                      {item.name}
                    </p>
                    <p className="text-blue-400 font-black text-sm">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-white/20 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    {/* Quantity controls */}
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-8 text-center text-white text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                      >
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

        {/* Footer — only show when items exist */}
        {items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-4 space-y-3">

            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Subtotal ({itemCount} items)</span>
              <span className="text-white font-black text-lg">{formatPrice(subtotal)}</span>
            </div>

            {/* Delivery note */}
            <p className="text-white/30 text-xs">
              Delivery fee calculated at checkout based on your location
            </p>

            {/* Payment methods */}
            <div className="flex items-center gap-2">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-2 py-1">
                <span className="text-yellow-400 text-xs font-bold">MTN MoMo</span>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-1">
                <span className="text-red-400 text-xs font-bold">Airtel Money</span>
              </div>
            </div>

            {/* Checkout button */}
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-black py-4 rounded-xl text-center hover:opacity-90 transition-all duration-200"
            >
              Proceed to Checkout
            </Link>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="w-full text-white/30 hover:text-red-400 text-xs text-center transition-colors duration-200 py-1"
            >
              Clear cart
            </button>

          </div>
        )}

      </div>
    </>
  )
}