import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getItemCount, openCart } = useCartStore()
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const itemCount = getItemCount()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-white/10">

      {/* Top bar */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 py-1.5 px-4 text-center">
        <p className="text-white text-xs font-medium">
          Free delivery in Kampala on orders above UGX 200,000 · Pay with MTN MoMo or Airtel Money
        </p>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-4 h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <span className="font-black text-white text-lg">P</span>
            </div>
            <div className="hidden md:block">
              <div className="font-black text-white text-base leading-none">PRESTIGE</div>
              <div className="text-white/40 text-xs tracking-widest">TECHSTORE</div>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search laptops, phones, cameras..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-2.5 text-white placeholder-white/30 text-sm outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/5">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden md:inline text-sm font-medium">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-gray-900 border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/account/orders" className="block px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 text-sm">My Orders</Link>
                  <Link to="/account/wishlist" className="block px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 text-sm">Wishlist</Link>
                  <Link to="/account/loyalty" className="block px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 text-sm">Loyalty Points</Link>
                  <button onClick={logout} className="block w-full text-left px-4 py-2.5 text-red-400 hover:bg-white/5 text-sm border-t border-white/10">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 text-white/60 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/5 text-sm font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Sign In
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 text-white/60 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden md:inline text-sm font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white/60 hover:text-white transition-colors p-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        </div>

        {/* Category navigation */}
        <nav className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto scrollbar-none">
          {['Laptops', 'Smartphones', 'Monitors', 'Cameras', 'Tablets', 'Headphones', 'Smartwatches', 'Power Banks', 'Accessories', 'Networking', 'Storage', 'Gaming'].map((cat) => (
            <Link
              key={cat}
              to={`/category/${cat.toLowerCase()}`}
              className="whitespace-nowrap text-white/50 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {cat}
            </Link>
          ))}
        </nav>

      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-white/10 px-4 py-4 space-y-2">
          {['Laptops', 'Smartphones', 'Monitors', 'Cameras', 'Tablets', 'Headphones', 'Smartwatches', 'Power Banks', 'Accessories', 'Networking', 'Storage', 'Gaming'].map((cat) => (
            <Link
              key={cat}
              to={`/category/${cat.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white/60 hover:text-white text-sm py-2 border-b border-white/5 last:border-0"
            >
              {cat}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-blue-400 text-sm py-2 font-medium"
            >
              Sign In / Register
            </Link>
          )}
        </div>
      )}

    </header>
  )
}