import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import landingPageBanner from '../assets/images/landingpagebanner.png'

const Home = () => {
  const [bestSellers, setBestSellers] = useState([])

  useEffect(() => {
    api.get('/products/best-sellers?limit=10').then((res) => {
      setBestSellers(res.data.data || [])
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 px-3 sm:px-6 lg:px-12 overflow-hidden">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 items-center">
        {/* Left: Hero text */}
        <div className="text-slate-900 space-y-4 sm:space-y-6 pr-0 lg:pr-4">
          <p className="uppercase tracking-[0.3em] text-xs sm:text-sm text-blue-600">
            embrace modest elegance
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            Modest Fashion for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500">
              Every Occasion
            </span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-lg leading-relaxed">
            Discover premium Abaya, Hijab, Pakistani Suits, and accessories crafted for comfort,
            elegance, and style. Curated collections for everyday wear, special occasions,
            and modest fashion enthusiasts.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-2">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-600/40 hover:shadow-xl hover:shadow-blue-600/60 transition duration-300"
            >
              Explore Collection
            </Link>
            <div className="flex flex-col text-xs text-slate-600">
              <span className="font-medium text-slate-700">✓ Free delivery on first order</span>
              <span className="text-slate-600">✓ Easy returns & secure checkout</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6">
            <div className="bg-white/60 backdrop-blur-sm border border-blue-200/50 rounded-lg p-3 sm:p-4 hover:bg-white/80 transition shadow-sm">
              <p className="font-bold text-blue-600 text-sm">100+</p>
              <p className="text-slate-600 text-xs">Styles & Designs</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm border border-cyan-200/50 rounded-lg p-3 sm:p-4 hover:bg-white/80 transition shadow-sm">
              <p className="font-bold text-cyan-600 text-sm">Premium</p>
              <p className="text-slate-600 text-xs">Quality Fabric</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm border border-teal-200/50 rounded-lg p-3 sm:p-4 hover:bg-white/80 transition shadow-sm">
              <p className="font-bold text-teal-600 text-sm">Elegant</p>
              <p className="text-slate-600 text-xs">Designs</p>
            </div>
          </div>
        </div>

        {/* Right: Hero image / cover */}
        <div className="relative h-64 sm:h-72 lg:h-96 mt-6 lg:mt-0">
          <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-tr from-blue-400 via-cyan-400 to-teal-400 opacity-40 blur-2xl" />

          <div className="relative h-full rounded-2xl lg:rounded-3xl bg-white/40 border border-blue-200/60 shadow-2xl overflow-hidden flex items-center justify-center backdrop-blur-sm">
            {/* Landing page banner image */}
            <img
              src={landingPageBanner}
              alt="Modest Fashion Landing Page Banner"
              className="w-full h-full object-cover rounded-2xl lg:rounded-3xl hover:scale-105 transition duration-500"
            />
          </div>
        </div>
      </div>

      {/* Best Sellers section */}
      {bestSellers.length > 0 && (
        <section className="mt-12 sm:mt-16 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            Best Sellers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {bestSellers.slice(0, 10).map(({ product, total_sold }) => (
              product && (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition"
                >
                    {product.image && (
                      <img
                        src={`http://127.0.0.1:8000/storage/${product.image}`}
                        alt={product.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition"
                        onError={(e) => {
                          console.warn('Image failed to load:', e.target.src)
                          e.target.onerror = null
                          const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-size="16" fill="#9ca3af" dominant-baseline="middle" text-anchor="middle">Image unavailable</text></svg>'
                          e.target.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
                        }}
                      />
                    )}
                  <div className="p-3">
                    <p className="font-semibold text-slate-900 truncate group-hover:text-blue-600">
                      {product.name}
                    </p>
                    <p className="text-blue-600 font-bold">${product.price}</p>
                    <p className="text-xs text-slate-500">{total_sold} sold</p>
                  </div>
                </Link>
              )
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition"
            >
              View All Products
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home

