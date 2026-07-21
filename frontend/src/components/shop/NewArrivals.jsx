import { useEffect, useState, useRef } from 'react'
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
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-green-100 transition-all duration-300 flex-shrink-0 w-64">
      <Link to={`/product/${product.slug || product.id}`} className="block relative">
        <div className="h-52 bg-gray-50 overflow-hidden p-4 flex items-center justify-center">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <svg className="w-16 h-16 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
          )}
        </div>
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
            -{discount}%
          </span>
        )}
        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
          New
        </span>
      </Link>

      <div className="p-4">
        <p className="text-gray-400 text-xs font-medium mb-1">{product.brand}</p>
        <Link to={`/product/${product.slug || product.id}`}>
          <h3 className="text-gray-800 text-sm font-semibold leading-tight mb-3 line-clamp-2 hover:text-green-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-900 font-black text-base">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-gray-300 text-xs line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
        <button
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-400 text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-200"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default function NewArrivals() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const itemsPerPage = 4

  useEffect(() => {
    api.get('/products?isNewArrival=true&limit=20')
      .then(res => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const totalPages = Math.ceil(products.length / itemsPerPage)
  const visible = products.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

  if (loading) {
    return (
      <section className="py-2">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6">New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-52 bg-gray-50" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-8 bg-gray-100 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="py-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900">New Arrivals</h2>
          <p className="text-gray-400 text-sm mt-1">Fresh stock just landed</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/new-arrivals" className="text-green-600 hover:text-green-700 text-sm font-semibold transition-colors mr-4">
            View all →
          </Link>
          {/* Arrows */}
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visible.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Page dots */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`transition-all duration-300 rounded-full ${
                i === page ? 'w-6 h-2 bg-green-600' : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}