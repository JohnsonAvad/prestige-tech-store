import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatters'
import useCartStore from '../../store/cartStore'

export default function ProductCard({ product }) {
  const { addItem } = useCartStore()

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all duration-300">

      {/* Image */}
      <Link to={`/product/${product.slug || product.id}`} className="block relative">
        <div className="aspect-square bg-gray-50 overflow-hidden p-4">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
              -{discount}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
              New
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-gray-400 text-xs mb-1 font-medium">{product.brand}</p>
        <Link to={`/product/${product.slug || product.id}`}>
          <h3 className="text-gray-800 text-sm font-semibold leading-tight mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.averageRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-200'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-400 text-xs">({product.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-900 font-black text-base">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-gray-300 text-xs line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 text-white disabled:cursor-not-allowed text-xs font-bold py-2.5 rounded-xl transition-all duration-200"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}