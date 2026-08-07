import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../utils/api'

export default function AddProduct() {
  const { id } = useParams(); 
  const [uploadingIndex, setUploadingIndex] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imageUrls, setImageUrls] = useState([])
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
  if (id) {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        // IMPORTANT: Some APIs return { product: {...} }, others return just {...}
        const p = response.data.product || response.data;

        // We must map the database values into your 'form' state object
        setForm({
          name: p.name || '',
          brand: p.brand || '',
          categoryId: p.categoryId || '',
          sku: p.sku || '',
          price: p.price || '',
          comparePrice: p.comparePrice || '',
          description: p.description || '',
          // MAPPING: Ensure this matches what you saved from the CSV
          stock: p.stock || p.stock_quantity || '', 
          isFeatured: p.isFeatured || false,
          isNewArrival: p.isNewArrival || false,
          tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
        });

        // Set the images separately since you have a separate state for them
        setImageUrls(p.images && p.images.length > 0 ? p.images : ['']);
        
        // If you have specs
        if (p.specs) {
          const specArray = Object.entries(p.specs).map(([key, value]) => ({ key, value }));
          setSpecs(specArray.length > 0 ? specArray : [{ key: '', value: '' }]);
        }

      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Could not load product details.");
      }
    };
    fetchProduct();
  }
}, [id]); // This ensures it runs every time you click a different product
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
  const updated = [...imageUrls];
  updated[index] = value;
  setImageUrls(updated);
  
  // If your form state also tracks images, update it here too:
  setForm(prev => ({
    ...prev,
    images: updated.filter(u => u.trim() !== '')
  }));
};

  const handleSpec = (index, field, value) => {
    const updated = [...specs]
    updated[index][field] = value
    setSpecs(updated)
  }

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    // 1. Process Specs
    const specsObj = {};
    specs.forEach(s => {
      if (s.key && s.value) specsObj[s.key] = s.value;
    });

    // 2. Clean Images (The Genius Line)
    const finalImages = imageUrls.filter(url => url && typeof url === 'string' && url.trim() !== "");

    // 3. Prepare the Data Object
    const data = {
      name: form.name,
      brand: form.brand,
      categoryId: form.categoryId,
      sku: form.sku || (id ? undefined : `SKU-${Date.now()}`), // Don't generate new SKU if editing
      price: parseFloat(form.price) || 0,
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
      description: form.description,
      stock: parseInt(form.stock) || 0,
      isFeatured: form.isFeatured,
      isNewArrival: form.isNewArrival,
      images: finalImages,
      specs: specsObj,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
    };

    // 4. CHOOSE BETWEEN UPDATE (PUT) OR CREATE (POST)
    if (id) {
      // EDITING MODE
      await api.put(`/products/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Product updated successfully!');
    } else {
      // ADDING MODE
      await api.post('/products', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Product created successfully!');
    }

    // 5. Redirect after success
    setTimeout(() => navigate('/admin/products'), 1500);

  } catch (err) {
    console.error(err);
    setError(err.response?.data?.error || 'Failed to save product.');
  } finally {
    setLoading(false);
  }
};
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
<div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9' }}>
  <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Product Images</h2>
  <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Upload from your computer or paste an image URL.</p>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {imageUrls.map((url, i) => (
      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {/* Preview */}
        <div style={{ width: '56px', height: '56px', flexShrink: 0, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {url ? (
            <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} />
          ) : (
            <span style={{ fontSize: '10px', color: '#cbd5e1' }}>IMG</span>
          )}
        </div>

        {/* URL input */}
        <input
          value={url}
          onChange={e => handleImageUrl(i, e.target.value)}
          placeholder={`Image ${i + 1} URL — https://...`}
          style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', color: '#0f172a' }}
        />

        {/* Upload button */}
        <label style={{ flexShrink: 0, cursor: 'pointer' }}>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files[0]
              if (!file) return
              const formData = new FormData()
              formData.append('image', file)
              try {
                setUploadingIndex(i)
                const res = await fetch('https://prestige-tech-store-api.vercel.app/api/upload', {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${token}` },
                  body: formData
                })
                const data = await res.json()
                if (data.url) handleImageUrl(i, data.url)
              } catch (err) {
                console.error('Upload failed:', err)
              } finally {
                setUploadingIndex(null)
              }
            }}
          />
          <div style={{
            background: uploadingIndex === i ? '#e2e8f0' : '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap'
          }}>
            {uploadingIndex === i ? 'Uploading...' : '📁 Upload'}
          </div>
        </label>

        {/* Remove button */}
        {imageUrls.length > 1 && (
          <button
            type="button"
            onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))}
            style={{ color: '#cbd5e1', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', flexShrink: 0 }}
          >×</button>
        )}
      </div>
    ))}

    {imageUrls.length < 6 && (
      <button
        type="button"
        onClick={() => setImageUrls([...imageUrls, ''])}
        style={{ color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, textAlign: 'left' }}
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
  {loading 
    ? (id ? 'Updating Product...' : 'Creating Product...') 
    : (id ? 'Update Product' : 'Create Product')}
</button>
          </div>

        </form>
      </div>
    </div>
  )
}
