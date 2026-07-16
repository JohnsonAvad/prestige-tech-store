import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import ProductGrid from '../../components/shop/ProductGrid'
import CartDrawer from '../../components/shop/CartDrawer'
import api from '../../utils/api'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!query) {
      setLoading(false)
      return
    }
    setLoading(true)
    api.get(`/products?search=${encodeURIComponent(query)}&limit=24`)
      .then(res => {
        setProducts(res.data.products || [])
        setTotal(res.data.total || 0)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <CartDrawer />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
            {query ? `Search results for "${query}"` : 'Search Products'}
          </h1>
          {!loading && query && (
            <p className="text-white/40 text-sm">
              {total} result{total !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* No query */}
        {!query && (
          <div className="text-center py-24">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-white/40">Enter a search term to find products</p>
          </div>
        )}

        {/* Results */}
        {query && (
          <ProductGrid products={products} loading={loading} cols={4} />
        )}

        {/* No results */}
        {!loading && query && products.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">😕</span>
            <h3 className="text-white font-bold text-xl mb-2">No results found</h3>
            <p className="text-white/40 text-sm mb-6">
              Try different keywords or browse our categories
            </p>
            <Link
              to="/"
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-500 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}

      </div>
      <Footer />
    </div>
  )
}