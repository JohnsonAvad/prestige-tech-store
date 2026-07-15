import { useState } from 'react'

export default function ImageGallery({ images = [], name = '' }) {
  const [selected, setSelected] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const displayImages = images.length > 0 ? images : [null]

  return (
    <div className="flex flex-col gap-3">

      {/* Main Image */}
      <div
        className="relative aspect-square bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-zoom-in"
        onClick={() => setZoomed(!zoomed)}
      >
        {displayImages[selected] ? (
          <img
            src={displayImages[selected]}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-300 ${zoomed ? 'scale-150' : 'scale-100'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">
            📦
          </div>
        )}

        {/* Zoom hint */}
        <div className="absolute bottom-3 right-3 bg-black/40 text-white/60 text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
          {zoomed ? 'Click to zoom out' : 'Click to zoom in'}
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setSelected(i)
                setZoomed(false)
              }}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                selected === i
                  ? 'border-blue-500'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              {img ? (
                <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-xl">📦</div>
              )}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}