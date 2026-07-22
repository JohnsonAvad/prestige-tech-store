import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import ImageGallery from '../../components/shop/ImageGallery'
import ProductGrid from '../../components/shop/ProductGrid'
import CartDrawer from '../../components/shop/CartDrawer'
import useCartStore from '../../store/cartStore'
import api from '../../utils/api'
import { formatPrice, formatDate } from '../../utils/formatters'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [addedToCart, setAddedToCart] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const { addItem } = useCartStore()

  useEffect(() => {
    setLoading(true)
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data.product)
        if (res.data.product?.categoryId) {
          api.get(`/products?category=${res.data.product.categoryId}&limit=4`)
            .then(r => setRelated(r.data.products?.filter(p => p.id !== id) || []))
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const discount = product?.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-white/5 rounded animate-pulse w-3/4" />
              <div className="h-6 bg-white/5 rounded animate-pulse w-1/2" />
              <div className="h-12 bg-white/5 rounded animate-pulse w-1/3" />
              <div className="h-32 bg-white/5 rounded animate-pulse" />
              <div className="h-12 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <CartDrawer />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-24 text-center">
          <span className="text-6xl mb-4 block">😕</span>
          <h2 className="text-white font-bold text-2xl mb-2">Product not found</h2>
          <p className="text-white/40 mb-6">This product may have been removed or does not exist.</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500 transition-colors">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/40 mb-6 flex-wrap">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category?.slug}`} className="hover:text-white transition-colors">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-white line-clamp-3">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

          {/* Left — Image Gallery */}
          <ImageGallery images={product.images} name={product.name} />

          {/* Right — Product Info */}
          <div className="flex flex-col gap-4">

            {/* Brand and badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-blue-400 text-sm font-bold">{product.brand}</span>
              {product.isNewArrival && (
                <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-2 py-0.5 rounded-lg">New Arrival</span>
              )}
              {product.isFeatured && (
                <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold px-2 py-0.5 rounded-lg">Featured</span>
              )}
              {discount > 0 && (
                <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-2 py-0.5 rounded-lg">{discount}% OFF</span>
              )}
            </div>

            {/* Product name */}
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.averageRating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-white/20'}`} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white/60 text-sm">{product.averageRating} ({product.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-white/30 text-lg line-through">{formatPrice(product.comparePrice)}</span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 10 ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-400 text-sm font-medium">In Stock</span>
                </>
              ) : product.stock > 0 ? (
                <>
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <span className="text-yellow-400 text-sm font-medium">Only {product.stock} left</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-red-400 text-sm font-medium">Out of Stock</span>
                </>
              )}
              <span className="text-white/20">·</span>
              <span className="text-white/40 text-sm">SKU: {product.sku}</span>
            </div>

            {/* Quantity selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm font-medium">Quantity:</span>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center text-white font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all duration-200 text-sm ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : product.stock === 0
                    ? 'bg-gray-700 text-white/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'
                }`}
              >
                {addedToCart ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart
                  </>
                ) : product.stock === 0 ? 'Out of Stock' : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                  wishlisted
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-red-400 hover:border-red-500/30'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Payment methods */}
            <div className="bg-white/3 border border-white/8 rounded-xl p-3">
              <p className="text-white/40 text-xs mb-2 font-medium">Secure Payment Methods</p>
              <div className="flex items-center gap-2">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5">
                  <span className="text-yellow-400 text-xs font-bold">MTN MoMo</span>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5">
                  <span className="text-red-400 text-xs font-bold">Airtel Money</span>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5">
                  <span className="text-green-400 text-xs font-bold">Free Delivery*</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs — Description, Specs, Reviews */}
        <div className="mb-8">
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 mb-6 w-fit">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Description */}
          {activeTab === 'description' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              {product.description ? (
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              ) : (
                <p className="text-white/30 text-sm">No description available for this product.</p>
              )}
            </div>
          )}

          {/* Specifications */}
          {activeTab === 'specifications' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              {product.specs && Object.keys(product.specs).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                      <span className="text-white/40 text-sm w-32 shrink-0">{key}</span>
                      <span className="text-white/80 text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/30 text-sm">No specifications available.</p>
              )}
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              {product.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map(review => (
                    <div key={review.id} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                            <span className="text-blue-400 text-xs font-bold">
                              {review.user?.name?.[0] || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{review.user?.name || 'Customer'}</p>
                            <p className="text-white/30 text-xs">{formatDate(review.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-white/20'}`} viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      {review.title && <p className="text-white text-sm font-semibold mb-1">{review.title}</p>}
                      {review.body && <p className="text-white/60 text-sm leading-relaxed">{review.body}</p>}
                      {review.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-green-400 text-xs mt-2">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl block mb-3">⭐</span>
                  <p className="text-white/40 text-sm">No reviews yet. Be the first to review this product.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-black text-white mb-6">You May Also Like</h2>
            <ProductGrid products={related} loading={false} cols={4} />
          </section>
        )}

      </div>

      <Footer />
    </div>
  )
}