import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import api from '../../utils/api'

export default function NewArrivals() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products?isNewArrival=true&limit=8')
      .then(res => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6">New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-50" />
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
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900">New Arrivals</h2>
          <p className="text-gray-400 text-sm mt-1">Fresh stock just landed</p>
        </div>
        <Link to="/new-arrivals" className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors">
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