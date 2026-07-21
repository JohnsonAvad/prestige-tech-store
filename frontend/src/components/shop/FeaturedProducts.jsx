import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatters'
import useCartStore from '../../store/cartStore'
import api from '../../utils/api'

function ProductCard({ product }) {
  const { addItem } = useCartStore()
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="group bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-100 transition-all duration-300">
      <Link to={`/product/${product.slug || product.id}`} className="block relative">
        <div className="h-44 bg-white overflow-hidden p-3 flex items-center justify-center">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <svg className="w-12 h-12 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
          )}
        </div>
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
            -{discount}%
          </span>
        )}
      </Link>

      <div className="p-3">
        <p className="text-gray-400 text-xs font-medium mb-1">{product.brand}</p>
        <Link to={`/product/${product.slug || product.id}`}>
          <h3 className="text-gray-800 text-xs font-semibold leading-tight mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-900 font-black text-sm">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-gray-300 text-xs line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
        <button
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 text-white text-xs font-bold py-2 rounded-xl transition-all duration-200"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/products?isFeatured=true&limit=8')
      .then(res => setProducts(res.data.products || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded" />
                <div className="h-7 bg-gray-100 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4">Featured Products</h2>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-red-500 text-sm">Could not load products. Make sure backend is running.</p>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900">Featured Products</h2>
          <p className="text-gray-400 text-sm mt-1">Handpicked for you</p>
        </div>
        <Link to="/products" className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}