import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../utils/constants'

export default function CategoryGrid() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-black text-white">
          Shop by Category
        </h2>
        <Link to="/products" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            to={`/category/${category.slug}`}
            className="group relative bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-3 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-200 overflow-hidden"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200`}>
              {category.icon}
            </div>
            <span className="text-white/70 group-hover:text-white text-xs font-semibold text-center transition-colors duration-200">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}