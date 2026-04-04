import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { promoSlides } from '../helpers/db'
import { productImageUrl } from '../utils/productImage'

const PromoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [imageError, setImageError] = useState({})

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoSlides.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [isPaused])

  const current = promoSlides[currentIndex]
  const hasValidImage =
    current.image && current.image.trim() !== '' && !imageError[current.id]

  return (
    <div
      className="relative w-full mb-10 rounded-2xl overflow-hidden border border-zinc-700/80 shadow-2xl shadow-black/40"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="relative px-5 py-10 md:px-12 md:py-12 min-h-[200px] md:min-h-[220px] text-white transition-all duration-500 ease-in-out overflow-hidden"
        style={{
          background: hasValidImage ? '#0f172a' : undefined,
        }}
      >
        {!hasValidImage && (
          <div
            className="absolute inset-0 z-0"
            style={{ background: current.backgroundColor }}
          />
        )}
        {hasValidImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={productImageUrl(current.image)}
              alt=""
              className="w-full h-full object-cover opacity-50"
              onError={() =>
                setImageError((prev) => ({ ...prev, [current.id]: true }))
              }
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
          </div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400/90 mb-2">
              StrideLab
            </p>
            <h3 className="text-2xl md:text-3xl font-bold font-display tracking-tight mb-2">
              {current.title}
            </h3>
            <p className="text-sm md:text-base text-zinc-300 max-w-xl">
              {current.subtitle}
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center shrink-0 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors"
          >
            Shop kicks →
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {promoSlides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-10 bg-amber-500'
                : 'w-2 bg-zinc-500 hover:bg-zinc-400'
            }`}
            aria-label={`Promo slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default PromoCarousel
