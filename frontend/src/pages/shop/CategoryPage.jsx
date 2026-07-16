import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import CartDrawer from '../../components/shop/CartDrawer'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import ProductGrid from '../../components/shop/ProductGrid'
import api from '../../utils/api'
import { CATEGORIES, SORT_OPTIONS } from '../../utils/constants'

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under UGX 100K', min: 0, max: 100000 },
  { label: 'UGX 100K - 500K', min: 100000, max: 500000 },
  { label: 'UGX 500K - 1M', min: 500000, max: 1000000 },
  { label: 'UGX 1M - 3M', min: 1000000, max: 3000000 },
  { label: 'Above UGX 3M', min: 3000000, max: Infinity },
]

export default function CategoryPage() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [brands, setBrands] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  const currentPage = parseInt(searchParams.get('page') || '1')
  const sortBy = searchParams.get('sort') || 'newest'
  const selectedBrand = searchParams.get('brand') || ''
  const selectedPriceRange = parseInt(searchParams.get('price') || '0')
  const limit = 24

  const category = CATEGORIES.find(c => c.slug === slug)

  useEffect(() => {
    setLoading(true)
    const priceRange = PRICE_RANGES[selectedPriceRange]
    const params = new URLSearchParams({
      category: slug,
      sort: sortBy,
      page: currentPage,
      limit,
      ...(selectedBrand && { brand: selectedBrand }),
      ...(priceRange.min > 0 && { minPrice: priceRange.min }),
      ...(priceRange.max !== Infinity && { maxPrice: priceRange.max }),
    })

    api.get(`/products?${params}`)
      .then(res => {
        setProducts(res.data.products || [])
        setTotalCount(res.data.total || 0)
        const uniqueBrands = [...new Set((res.data.products || []).map(p => p.brand))].filter(Boolean)
        setBrands(uniqueBrands)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [slug, sortBy, currentPage, selectedBrand, selectedPriceRange])

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <CartDrawer/>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">{category?.name || slug}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {category?.icon} {category?.name || slug}
            </h1>
            {!loading && (
              <p className="text-white/40 text-sm mt-1">
                {totalCount} product{totalCount !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="md:hidden flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 px-4 py-2 rounded-xl text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters
          </button>
        </div>

        <div className="flex gap-6">

          {/* Sidebar Filters */}
          <aside className={`${filtersOpen ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0 space-y-6`}>

            {/* Sort */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <h3 className="text-white font-bold text-sm mb-3">Sort By</h3>
              <div className="space-y-1">
                {SORT_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateFilter('sort', option.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                      sortBy === option.value
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <h3 className="text-white font-bold text-sm mb-3">Price Range</h3>
              <div className="space-y-1">
                {PRICE_RANGES.map((range, i) => (
                  <button
                    key={i}
                    onClick={() => updateFilter('price', i === 0 ? '' : i)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                      selectedPriceRange === i
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <h3 className="text-white font-bold text-sm mb-3">Brand</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter('brand', '')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                      !selectedBrand
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => updateFilter('brand', brand)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                        selectedBrand === brand
                          ? 'bg-blue-600 text-white font-medium'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear filters */}
            {(selectedBrand || selectedPriceRange > 0 || sortBy !== 'newest') && (
              <button
                onClick={() => setSearchParams({})}
                className="w-full bg-red-500/10 border border-red-500/30 text-red-400 py-2 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-all duration-200"
              >
                Clear All Filters
              </button>
            )}

          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Product Grid */}
            <ProductGrid products={products} loading={loading} cols={3} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => updateFilter('page', currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 bg-white/5 border border-white/10 text-white/60 rounded-xl flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => updateFilter('page', page)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}

                <button
                  onClick={() => updateFilter('page', currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 bg-white/5 border border-white/10 text-white/60 rounded-xl flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}