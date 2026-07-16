import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import api from '../../utils/api'

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('FeaturedProducts: fetching from', api.defaults.baseURL)
    api.get('/products?isFeatured=true&limit=8')
      .then(res => {
        console.log('FeaturedProducts response:', res.data)
        setProducts(res.data.products || [])
      })
      .catch((err) => {
        console.error('FeaturedProducts error:', err.message)
        setError(err.message)
        setProducts([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section>
        <h2 className="text-xl md:text-2xl font-black text-white mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <h2 className="text-xl md:text-2xl font-black text-white mb-4">Featured Products</h2>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">Error loading products: {error}</p>
          <p className="text-white/40 text-xs mt-1">Make sure backend is running at localhost:3000</p>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section>
        <h2 className="text-xl md:text-2xl font-black text-white mb-4">Featured Products</h2>
        <p className="text-white/40 text-sm">No featured products found.</p>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-black text-white">
          Featured Products
        </h2>
        <Link to="/products" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
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