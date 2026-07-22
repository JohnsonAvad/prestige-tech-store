import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../utils/api'

export default function AddProduct() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imageUrls, setImageUrls] = useState([''])
  const [specs, setSpecs] = useState([{ key: '', value: '' }])
  const navigate = useNavigate()

  const token = localStorage.getItem('admin_token')

  const [form, setForm] = useState({
    name: '',
    brand: '',
    categoryId: '',
    sku: '',
    price: '',
    comparePrice: '',
    description: '',
    stock: '',
    isFeatured: false,
    isNewArrival: false,
    tags: '',
  })

  useEffect(() => {
  if (!token) {
    navigate('/admin/login')
    return
  }
  fetch('https://prestige-tech-store-api.vercel.app/api/categories')
    .then(res => res.json())
    .then(data => setCategories(data.categories || []))
    .catch(err => console.log('Categories error:', err))
}, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUrl = (index, value) => {
    const updated = [...imageUrls]
    updated[index] = value
    setImageUrls(updated)
  }

  const handleSpec = (index, field, value) => {
    const updated = [...specs]
    updated[index][field] = value
    setSpecs(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const specsObj = {}
      specs.forEach(s => {
        if (s.key && s.value) specsObj[s.key] = s.value
      })

      const images = imageUrls.filter(url => url.trim())

      const data = {
        name: form.name,
        brand: form.brand,
        categoryId: form.categoryId,
        sku: form.sku || `SKU-${Date.now()}`,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        description: form.description,
        stock: parseInt(form.stock) || 0,
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        images,
        specs: specsObj,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      }

      await api.post('/products', data, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSuccess(true)
      setTimeout(() => navigate('/admin/products'), 1500)

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create product.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to="/admin/products" className="text-white/40 hover:text-white transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-white font-black text-lg">Add New Product</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 mb-6">
            <p className="text-green-400 text-sm font-medium">Product created successfully! Redirecting...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-sm mb-4 uppercase tracking-wide">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <label className="block text-white/60 text-xs font-medium mb-2">Product Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Samsung Galaxy S24 Ultra 256GB"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs font-medium mb-2">Brand *</label>
                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Samsung"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs font-medium mb-2">Category *</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-all"
                >
                  <option value="" className="bg-gray-900">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-gray-900">{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/60 text-xs font-medium mb-2">SKU</label>
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="e.g. SAMS-S24U-256 (auto-generated if empty)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs font-medium mb-2">Tags</label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="e.g. smartphone, samsung, android (comma separated)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-blue-500 transition-all"
                />
              </div>

            </div>
          </div>

          {/* Pricing and Stock */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-sm mb-4 uppercase tracking-wide">Pricing and Stock</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div>
                <label className="block text-white/60 text-xs font-medium mb-2">Selling Price (UGX) *</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  type="number"
                  placeholder="e.g. 3200000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs font-medium mb-2">Compare Price (UGX)</label>
                <input
                  name="comparePrice"
                  value={form.comparePrice}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g. 3500000 (original price)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs font-medium mb-2">Stock Quantity *</label>
                <input
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  type="number"
                  placeholder="e.g. 25"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-blue-500 transition-all"
                />
              </div>

            </div>
          </div>

          {/* Description */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-sm mb-4 uppercase tracking-wide">Description</h2>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the product — key features, what makes it special..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Images */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-sm mb-4 uppercase tracking-wide">Product Images</h2>
            <p className="text-white/40 text-xs mb-4">
              Paste image URLs. Find images on Jumia, manufacturer websites or Unsplash.
            </p>
            <div className="space-y-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-12 h-12 shrink-0 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    {url ? (
                      <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">IMG</div>
                    )}
                  </div>
                  <input
                    value={url}
                    onChange={(e) => handleImageUrl(i, e.target.value)}
                    placeholder={`Image ${i + 1} URL — https://...`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-blue-500 transition-all"
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))}
                      className="text-white/20 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {imageUrls.length < 6 && (
                <button
                  type="button"
                  onClick={() => setImageUrls([...imageUrls, ''])}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  + Add another image
                </button>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-sm mb-4 uppercase tracking-wide">Specifications</h2>
            <div className="space-y-3">
              {specs.map((spec, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    value={spec.key}
                    onChange={(e) => handleSpec(i, 'key', e.target.value)}
                    placeholder="e.g. RAM"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-blue-500 transition-all"
                  />
                  <input
                    value={spec.value}
                    onChange={(e) => handleSpec(i, 'value', e.target.value)}
                    placeholder="e.g. 12GB"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-blue-500 transition-all"
                  />
                  {specs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
                      className="text-white/20 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSpecs([...specs, { key: '', value: '' }])}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                + Add specification
              </button>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-sm mb-4 uppercase tracking-wide">Visibility</h2>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-600"
                />
                <div>
                  <p className="text-white text-sm font-medium">Featured Product</p>
                  <p className="text-white/40 text-xs">Shows in Featured section on homepage</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={form.isNewArrival}
                  onChange={handleChange}
                  className="w-4 h-4 accent-green-600"
                />
                <div>
                  <p className="text-white text-sm font-medium">New Arrival</p>
                  <p className="text-white/40 text-xs">Shows in New Arrivals section on homepage</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Link
              to="/admin/products"
              className="flex-1 bg-white/5 border border-white/10 text-white/60 py-3 rounded-xl text-center text-sm font-medium hover:bg-white/10 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white font-black py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Product...' : 'Create Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}