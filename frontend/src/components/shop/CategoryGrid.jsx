import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const CATEGORIES = [
  {
    name: 'Laptops', slug: 'laptops',
    color: 'text-blue-600', bg: 'bg-blue-50',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80'
  },
  {
    name: 'Smartphones', slug: 'smartphones',
    color: 'text-green-600', bg: 'bg-green-50',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&q=80'
  },
  {
    name: 'Tablets', slug: 'tablets',
    color: 'text-purple-600', bg: 'bg-purple-50',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80'
  },
  {
    name: 'Monitors', slug: 'monitors',
    color: 'text-orange-600', bg: 'bg-orange-50',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80'
  },
  {
    name: 'Headphones', slug: 'headphones',
    color: 'text-pink-600', bg: 'bg-pink-50',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80'
  },
  {
    name: 'Smartwatches', slug: 'smartwatches',
    color: 'text-teal-600', bg: 'bg-teal-50',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80'
  },
  {
    name: 'Power Banks', slug: 'power-banks',
    color: 'text-yellow-600', bg: 'bg-yellow-50',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&q=80'
  },
  {
    name: 'Cameras', slug: 'cameras',
    color: 'text-red-600', bg: 'bg-red-50',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&q=80'
  },
  {
    name: 'Accessories', slug: 'accessories',
    color: 'text-indigo-600', bg: 'bg-indigo-50',
    image: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=300&q=80'
  },
  {
    name: 'Gaming', slug: 'gaming',
    color: 'text-cyan-600', bg: 'bg-cyan-50',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&q=80'
  },
  {
    name: 'Networking', slug: 'networking',
    color: 'text-slate-600', bg: 'bg-slate-50',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&q=80'
  },
  {
    name: 'Storage', slug: 'storage',
    color: 'text-emerald-600', bg: 'bg-emerald-50',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80'
  },
]

export default function CategoryGrid() {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    const container = scrollRef.current
    if (!container) return
    const scrollAmount = 300
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  return (
    <section className="py-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900">Shop by Category</h2>
          <p className="text-gray-400 text-sm mt-1">Find exactly what you need</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-300 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-300 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            to={`/category/${category.slug}`}
            className="group flex-shrink-0 w-36 bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden hover:border-green-200 hover:shadow-md transition-all duration-200"
          >
            {/* Category image */}
            <div className="h-28 overflow-hidden bg-white">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Category name */}
            <div className="px-3 py-2.5">
              <p className={`text-xs font-bold ${category.color} group-hover:underline transition-all`}>
                {category.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}