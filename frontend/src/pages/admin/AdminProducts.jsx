import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { formatPrice } from '../../utils/formatters'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleteId, setDeleteId] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem('admin_token')

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchProducts()
  }, [page, search])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(search && { search })
      })
      const res = await api.get(`/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(res.data.products || [])
      setTotal(res.data.total || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDeleteId(null)
      fetchProducts()
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleFeatured = async (id) => {
    try {
      await api.patch(`/products/${id}/featured`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchProducts()
    } catch (err) {
      console.error(err)
    }
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-white/40 hover:text-white transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-white font-black text-lg">Products</h1>
              <p className="text-white/40 text-xs">{total} total products</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/products/import"
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import CSV
            </Link>
            <Link
              to="/admin/products/add"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search products by name or brand..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-blue-500 transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        {/* Products Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/40 text-xs font-semibold px-4 py-3">Product</th>
                  <th className="text-left text-white/40 text-xs font-semibold px-4 py-3">Category</th>
                  <th className="text-left text-white/40 text-xs font-semibold px-4 py-3">Price</th>
                  <th className="text-left text-white/40 text-xs font-semibold px-4 py-3">Stock</th>
                  <th className="text-left text-white/40 text-xs font-semibold px-4 py-3">Status</th>
                  <th className="text-left text-white/40 text-xs font-semibold px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="px-4 py-3" colSpan={6}>
                        <div className="h-8 bg-white/5 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-white/40 text-sm">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product, i) => (
                    <tr key={product.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? '' : 'bg-white/2'}`}>

                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 shrink-0 bg-white/5 rounded-lg overflow-hidden">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                            )}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium line-clamp-1">{product.name}</p>
                            <p className="text-white/40 text-xs">{product.brand} · {product.sku}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className="text-white/60 text-xs">{product.category?.name}</span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3">
                        <span className="text-white text-sm font-bold">{formatPrice(product.price)}</span>
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${
                          product.stock === 0 ? 'text-red-400' :
                          product.stock <= 5 ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {product.stock === 0 ? 'Out of stock' : `${product.stock} units`}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {product.isFeatured && (
                            <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium">
                              Featured
                            </span>
                          )}
                          {product.isNewArrival && (
                            <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                              New
                            </span>
                          )}
                          {!product.isFeatured && !product.isNewArrival && (
                            <span className="bg-white/5 text-white/30 text-xs px-2 py-0.5 rounded-full">
                              Standard
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleFeatured(product.id)}
                            title="Toggle Featured"
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                              product.isFeatured
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-white/5 text-white/30 hover:text-blue-400'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={product.isFeatured ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>

                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="w-7 h-7 bg-white/5 text-white/30 hover:text-white rounded-lg flex items-center justify-center transition-all"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>

                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="w-7 h-7 bg-white/5 text-white/30 hover:text-red-400 rounded-lg flex items-center justify-center transition-all"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
              <p className="text-white/40 text-xs">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/60 rounded-lg text-xs disabled:opacity-30 hover:bg-white/10 transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/60 rounded-lg text-xs disabled:opacity-30 hover:bg-white/10 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-bold text-lg mb-2">Delete Product?</h3>
            <p className="text-white/50 text-sm mb-6">
              This product will be removed from the store. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-white/5 border border-white/10 text-white/60 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-500/10 border border-red-500/30 text-red-400 py-2.5 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}