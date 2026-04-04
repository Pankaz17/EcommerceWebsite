import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import ShoeCard from '../components/ShoeCard'
import { productImageUrl } from '../utils/productImage'

const Home = () => {
  const [featured, setFeatured] = useState([])
  const [bestIds, setBestIds] = useState(() => new Set())

  useEffect(() => {
    api
      .get('/products?per_page=8&sort_by=created_at&sort_order=desc')
      .then((res) => {
        const list = res.data.data ?? res.data ?? []
        setFeatured(Array.isArray(list) ? list.slice(0, 8) : [])
      })
      .catch(() => {})
    api
      .get('/products/best-sellers?limit=12')
      .then((res) => {
        const rows = res.data.data || []
        const ids = new Set(
          rows.map((r) => r.product?.id).filter(Boolean)
        )
        setBestIds(ids)
      })
      .catch(() => {})
  }, [])

  const heroImg = '/images/placeholders/shoe-casual.svg'

  return (
    <div className="w-full">
      {/* Hero — asymmetric, full-bleed feel */}
      <section className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-16 overflow-hidden rounded-b-3xl bg-zinc-950 min-h-[min(88vh,920px)] flex flex-col">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(245,158,11,0.25), transparent), radial-gradient(ellipse 60% 50% at 10% 80%, rgba(139,92,246,0.2), transparent)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/70 to-zinc-950" />

        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-12 lg:py-20 max-w-7xl mx-auto w-full">
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <p className="font-display text-xs sm:text-sm uppercase tracking-[0.35em] text-amber-500">
              StrideLab · Kathmandu
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              Lace up.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-violet-400">
                Move different.
              </span>
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg max-w-md leading-relaxed">
              Performance runners, street sneakers, boots, and everyday pairs —
              curated for grip, fit, and style. Same checkout you trust, including
              eSewa.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-900/30"
              >
                Shop all shoes
              </Link>
              <Link
                to="/products?category=Running"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-600 px-6 py-3.5 text-sm font-medium text-zinc-200 hover:border-amber-500/60 hover:text-amber-400 transition-colors"
              >
                Running
              </Link>
            </div>
            <dl className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-800/80 max-w-md">
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-zinc-500">
                  Brands
                </dt>
                <dd className="font-display text-xl font-bold text-white mt-1">
                  5+
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-zinc-500">
                  Types
                </dt>
                <dd className="font-display text-xl font-bold text-white mt-1">
                  4
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-zinc-500">
                  Focus
                </dt>
                <dd className="font-display text-xl font-bold text-amber-400 mt-1">
                  Fit
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 relative">
            <div className="absolute -right-20 -top-10 w-[120%] h-[80%] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative rotate-1 lg:rotate-2 rounded-2xl border border-zinc-700/50 overflow-hidden shadow-2xl shadow-black/50 bg-zinc-900 aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
              <img
                src={productImageUrl(heroImg)}
                alt=""
                className="w-full h-full object-cover opacity-95"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent">
                <p className="text-white font-display font-semibold text-lg">
                  Fresh pairs weekly
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  Filter by size, brand, color, and shoe type on the shop page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured — masonry-style dense grid */}
      <section className="max-w-7xl mx-auto mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
              Featured drops
            </h2>
            <p className="text-zinc-500 mt-2 max-w-xl">
              Newest arrivals first. Look for the violet &quot;New drop&quot; badge
              on the grid.
            </p>
          </div>
          <Link
            to="/products"
            className="text-amber-500 font-semibold text-sm hover:text-amber-400 transition-colors shrink-0"
          >
            View catalog →
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 p-12 text-center text-zinc-500">
            Loading lineup…{' '}
            <Link to="/products" className="text-amber-500 underline">
              Open shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {featured.slice(0, 4).map((p) => (
              <ShoeCard key={p.id} product={p} bestSellerIds={bestIds} />
            ))}
          </div>
        )}

        {featured.length > 4 && (
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {featured.slice(4, 8).map((p) => (
              <div
                key={p.id}
                className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/40 aspect-square group"
              >
                <Link to={`/products/${p.id}`} className="block h-full w-full">
                  <img
                    src={productImageUrl(p.image)}
                    alt={p.name}
                    className="h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  <p className="absolute bottom-3 left-3 right-3 font-display font-semibold text-white text-sm truncate">
                    {p.name}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA strip */}
      <section className="max-w-7xl mx-auto mb-24 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 px-8 py-12 sm:px-12 sm:py-16 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
          Know your size? Dial in the filters.
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto mb-8">
          Narrow by US size, brand, color, and shoe type — from road runners to
          winter boots.
        </p>
        <Link
          to="/products"
          className="inline-flex rounded-xl bg-white text-zinc-950 px-8 py-3.5 font-semibold hover:bg-zinc-200 transition-colors"
        >
          Open filter shop
        </Link>
      </section>
    </div>
  )
}

export default Home
