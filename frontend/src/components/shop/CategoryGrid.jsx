import { Link } from 'react-router-dom'

const CATEGORIES = [
  { name: 'Laptops', slug: 'laptops', color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-600',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2h-2M9 17v2m0 0h6m-6 0H7m6 0h2" /></svg> },
  { name: 'Smartphones', slug: 'smartphones', color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-600',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
  { name: 'Tablets', slug: 'tablets', color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-600',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
  { name: 'Monitors', slug: 'monitors', color: 'bg-orange-500', lightColor: 'bg-orange-50', textColor: 'text-orange-600',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
  { name: 'Headphones', slug: 'headphones', color: 'bg-pink-500', lightColor: 'bg-pink-50', textColor: 'text-pink-600',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg> },
  { name: 'Smartwatches', slug: 'smartwatches', color: 'bg-teal-500', lightColor: 'bg-teal-50', textColor: 'text-teal-600',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><rect x="5" y="2" width="14" height="20" rx="7"/><polyline points="12 6 12 12 16 14"/></svg> },
  { name: 'Power Banks', slug: 'power-banks', color: 'bg-yellow-500', lightColor: 'bg-yellow-50', textColor: 'text-yellow-600',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><rect x="2" y="7" width="18" height="11" rx="2" ry="2"/><path d="M22 11v3"/><line x1="6" y1="12" x2="10" y2="12"/><polyline points="10 9 13 12 10 15"/></svg> },
  { name: 'Cameras', slug: 'cameras', color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-600',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> },
  { name: 'Accessories', slug: 'accessories', color: 'bg-indigo-500', lightColor: 'bg-indigo-50', textColor: 'text-indigo-600',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg> },
  { name: 'Gaming', slug: 'gaming', color: 'bg-cyan-500', lightColor: 'bg-cyan-50', textColor: 'text-cyan-600',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="8" width="20" height="8" rx="4"/></svg> },
  { name: 'Networking', slug: 'networking', color: 'bg-slate-500', lightColor: 'bg-slate-50', textColor: 'text-slate-600',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
  { name: 'Storage', slug: 'storage', color: 'bg-emerald-500', lightColor: 'bg-emerald-50', textColor: 'text-emerald-600',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> },
]

export default function CategoryGrid() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-black text-gray-900">
          Shop by Category
        </h2>
        <Link to="/products" className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            to={`/category/${category.slug}`}
            className="group bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-3 hover:border-blue-200 hover:shadow-md transition-all duration-200"
          >
            <div className={`w-12 h-12 ${category.lightColor} ${category.textColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              {category.icon}
            </div>
            <span className="text-gray-700 group-hover:text-blue-600 text-xs font-semibold text-center transition-colors duration-200 leading-tight">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}