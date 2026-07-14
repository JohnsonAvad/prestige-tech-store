import { BRANDS } from '../../utils/constants'

export default function BrandStrip() {
  return (
    <section className="py-8 border-y border-white/10 overflow-hidden">
      <p className="text-white/30 text-xs font-semibold text-center tracking-widest uppercase mb-6">
        Genuine Products From Top Brands
      </p>
      <div className="flex gap-8 animate-scroll">
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-white/20 hover:text-white/60 text-sm font-bold transition-colors duration-200 cursor-pointer"
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  )
}