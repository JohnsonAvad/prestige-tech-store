const BRANDS = [
  'Apple', 'Samsung', 'HP', 'Dell', 'Lenovo',
  'Sony', 'LG', 'Asus', 'Acer', 'Microsoft',
  'Canon', 'Nikon', 'DJI', 'Bose', 'JBL',
  'Logitech', 'Anker', 'Xiaomi', 'Tecno', 'Infinix'
]

export default function BrandStrip() {
  return (
    <section className="py-8 border-y border-gray-100 overflow-hidden bg-white rounded-2xl">
      <p className="text-gray-400 text-xs font-semibold text-center tracking-widest uppercase mb-6">
        Genuine Products From Top Brands
      </p>
      <div className="flex gap-10 animate-scroll">
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-gray-300 hover:text-blue-600 text-sm font-black transition-colors duration-200 cursor-pointer tracking-wide"
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  )
}