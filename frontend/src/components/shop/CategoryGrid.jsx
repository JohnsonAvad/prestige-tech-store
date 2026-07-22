import { useRef } from 'react'
import { Link } from 'react-router-dom'

const CATEGORIES = [
  { name: 'Laptops', slug: 'laptops', color: '#2563eb', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80' },
  { name: 'Smartphones', slug: 'smartphones', color: '#16a34a', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&q=80' },
  { name: 'Tablets', slug: 'tablets', color: '#7c3aed', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80' },
  { name: 'Monitors', slug: 'monitors', color: '#ea580c', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80' },
  { name: 'Headphones', slug: 'headphones', color: '#db2777', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
  { name: 'Smartwatches', slug: 'smartwatches', color: '#0d9488', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80' },
  { name: 'Power Banks', slug: 'power-banks', color: '#ca8a04', img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&q=80' },
  { name: 'Cameras', slug: 'cameras', color: '#dc2626', img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&q=80' },
  { name: 'Accessories', slug: 'accessories', color: '#4f46e5', img: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=300&q=80' },
  { name: 'Gaming', slug: 'gaming', color: '#0891b2', img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&q=80' },
  { name: 'Networking', slug: 'networking', color: '#475569', img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&q=80' },
  { name: 'Storage', slug: 'storage', color: '#059669', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80' },
  { name: 'SmartHome', slug: 'smarthome', color: '#0891b2', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=300&q=80' },
{ name: 'Speakers', slug: 'speakers', color: '#7c3aed', img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80' },
]

export default function CategoryGrid() {
  const ref = useRef(null)
  const scroll = (dir) => ref.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>Shop by Category</div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Find exactly what you need</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => scroll('left')} style={{ width: '36px', height: '36px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
          <button onClick={() => scroll('right')} style={{ width: '36px', height: '36px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</button>
        </div>
      </div>

      <div ref={ref} className="hide-scrollbar" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
        {CATEGORIES.map(cat => (
          <Link key={cat.slug} to={`/category/${cat.slug}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '130px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#d1fae5'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ height: '100px', overflow: 'hidden', background: 'white' }}>
                <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{ padding: '10px 10px 12px', fontSize: '11px', fontWeight: 700, color: cat.color }}>
                {cat.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}