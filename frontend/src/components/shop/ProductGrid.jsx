import ProductCard from './ProductCard'

export default function ProductGrid({ products, loading, cols = 4 }) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  if (loading) {
    return (
      <div className={`grid ${gridCols[cols]} gap-4`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-white/5 rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-square bg-white/5" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-white/5 rounded w-1/3" />
              <div className="h-4 bg-white/5 rounded w-full" />
              <div className="h-4 bg-white/5 rounded w-2/3" />
              <div className="h-8 bg-white/5 rounded w-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-6xl mb-4">📦</span>
        <h3 className="text-white font-bold text-lg mb-2">No products found</h3>
        <p className="text-white/40 text-sm">
          Try adjusting your filters or search terms
        </p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[cols]} gap-4`}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}