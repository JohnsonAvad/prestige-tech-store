import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../utils/api'

export default function CSVImport() {
  const [file, setFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('admin_token')

  const downloadTemplate = () => {
    const headers = [
      'name', 'brand', 'category', 'price', 'comparePrice',
      'stock', 'sku', 'description', 'image1', 'image2',
      'isFeatured', 'isNewArrival', 'tags'
    ]
    const sample = [
      'Samsung Galaxy S24 Ultra', 'Samsung', 'Smartphones',
      '3200000', '3500000', '25', 'SAMS-S24U-256',
      'The ultimate Android smartphone with 200MP camera',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
      '', 'yes', 'no', 'smartphone,samsung,android'
    ]
    const csv = [headers.join(','), sample.join(',')].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prestige_techstore_products_template.csv'
    a.click()
  }

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
      const obj = {}
      headers.forEach((h, i) => obj[h] = values[i] || '')
      return obj
    })
  }

  const handleImport = async () => {
    if (!file) return
    setImporting(true)
    setError('')
    setResults(null)

    try {
      const text = await file.text()
      const rows = parseCSV(text)

      let success = 0
      let failed = 0
      const errors = []

      // Get categories first
      const catRes = await api.get('/categories')
      const categories = catRes.data.categories || []

      for (const row of rows) {
        try {
          if (!row.name || !row.brand || !row.price) {
            failed++
            errors.push(`Skipped: ${row.name || 'unnamed'} — missing required fields`)
            continue
          }

          const category = categories.find(c =>
            c.name.toLowerCase() === (row.category || '').toLowerCase() ||
            c.slug === (row.category || '').toLowerCase()
          )

          if (!category) {
            failed++
            errors.push(`Skipped: ${row.name} — category "${row.category}" not found`)
            continue
          }

          const images = [row.image1, row.image2].filter(Boolean)

          await api.post('/products', {
            name: row.name,
            brand: row.brand,
            categoryId: category.id,
            sku: row.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            price: parseFloat(row.price),
            comparePrice: row.comparePrice ? parseFloat(row.comparePrice) : undefined,
            stock: parseInt(row.stock) || 0,
            description: row.description || '',
            images,
            isFeatured: row.isFeatured?.toLowerCase() === 'yes',
            isNewArrival: row.isNewArrival?.toLowerCase() === 'yes',
            tags: row.tags ? row.tags.split(';').map(t => t.trim()) : [],
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })

          success++

        } catch (err) {
          failed++
          errors.push(`Failed: ${row.name} — ${err.response?.data?.error || err.message}`)
        }
      }

      setResults({ success, failed, errors, total: rows.length })

    } catch (err) {
      setError('Failed to parse CSV file. Make sure it matches the template format.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">

      <div className="bg-white/5 border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link to="/admin/products" className="text-white/40 hover:text-white transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-white font-black text-lg">Bulk CSV Import</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">

        {/* Step 1 — Download Template */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0 font-black text-white text-sm">1</div>
            <div className="flex-1">
              <h2 className="text-white font-bold mb-1">Download the Template</h2>
              <p className="text-white/40 text-sm mb-4">
                Download our CSV template and fill it in with your products. Do not change the column headers.
              </p>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 bg-blue-600/10 border border-blue-600/30 text-blue-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600/20 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Template CSV
              </button>
            </div>
          </div>
        </div>

        {/* Step 2 — Fill Template */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0 font-black text-white text-sm">2</div>
            <div className="flex-1">
              <h2 className="text-white font-bold mb-1">Fill in Your Products</h2>
              <p className="text-white/40 text-sm mb-3">Open the template in Excel or Google Sheets and fill in your products.</p>
              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                {[
                  ['name', 'Full product name — e.g. Samsung Galaxy S24 Ultra'],
                  ['brand', 'Brand name — e.g. Samsung, Apple, HP'],
                  ['category', 'Must match exactly: Laptops, Smartphones, Monitors, Cameras, Tablets, Headphones, Smartwatches, Power Banks, Accessories, Networking, Storage, Gaming'],
                  ['price', 'Selling price in UGX numbers only — e.g. 3200000'],
                  ['comparePrice', 'Original price if on sale — leave blank if no discount'],
                  ['stock', 'Number of units available — e.g. 25'],
                  ['sku', 'Your product code — leave blank to auto-generate'],
                  ['description', 'Product description — 2 to 3 sentences'],
                  ['image1', 'URL of main product image'],
                  ['image2', 'URL of second image (optional)'],
                  ['isFeatured', 'Type yes to show on homepage Featured section'],
                  ['isNewArrival', 'Type yes to show in New Arrivals section'],
                  ['tags', 'Keywords separated by semicolons — e.g. smartphone;android;samsung'],
                ].map(([col, desc]) => (
                  <div key={col} className="flex gap-2 text-xs">
                    <span className="text-blue-400 font-mono shrink-0 w-24">{col}</span>
                    <span className="text-white/40">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 — Upload */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0 font-black text-white text-sm">3</div>
            <div className="flex-1">
              <h2 className="text-white font-bold mb-1">Upload Your CSV File</h2>
              <p className="text-white/40 text-sm mb-4">
                Save your spreadsheet as CSV then upload it here.
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div
                className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-blue-500/30 transition-all cursor-pointer"
                onClick={() => document.getElementById('csv-input').click()}
              >
                <input
                  id="csv-input"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file ? (
                  <div>
                    <p className="text-green-400 font-semibold text-sm mb-1">✅ {file.name}</p>
                    <p className="text-white/40 text-xs">Click to change file</p>
                  </div>
                ) : (
                  <div>
                    <svg className="w-8 h-8 text-white/20 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-white/40 text-sm">Click to select your CSV file</p>
                    <p className="text-white/20 text-xs mt-1">Only .csv files accepted</p>
                  </div>
                )}
              </div>

              {file && !results && (
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-black py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {importing ? 'Importing products...' : `Import Products from ${file.name}`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Import Results */}
        {results && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold mb-4">Import Results</h2>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                <p className="text-green-400 font-black text-2xl">{results.success}</p>
                <p className="text-green-400/60 text-xs">Imported</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                <p className="text-red-400 font-black text-2xl">{results.failed}</p>
                <p className="text-red-400/60 text-xs">Failed</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                <p className="text-blue-400 font-black text-2xl">{results.total}</p>
                <p className="text-blue-400/60 text-xs">Total</p>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div className="bg-white/5 rounded-xl p-4 space-y-1 max-h-48 overflow-y-auto">
                {results.errors.map((err, i) => (
                  <p key={i} className="text-red-400/70 text-xs">{err}</p>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setResults(null); setFile(null) }}
                className="flex-1 bg-white/5 border border-white/10 text-white/60 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-all"
              >
                Import More
              </button>
              <Link
                to="/admin/products"
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold py-2.5 rounded-xl text-center text-sm hover:opacity-90 transition-all"
              >
                View All Products
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}