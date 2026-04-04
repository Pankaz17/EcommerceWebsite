import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import PromoCarousel from '../components/PromoCarousel'
import ShoeCard from '../components/ShoeCard'
import { productImageUrl } from '../utils/productImage'
import { SHOE_SIZES, SHOE_COLORS } from '../constants/shoeFilters'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const initialQ = searchParams.get('search') || ''
  const [search, setSearch] = useState(initialQ)
  const [debouncedSearch, setDebouncedSearch] = useState(initialQ)
  const [filters, setFilters] = useState(() => ({
    brand: searchParams.get('brand') || '',
    category: searchParams.get('category') || '',
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
  }))
  const [bestSellers, setBestSellers] = useState([])
  const debounceTimer = useRef(null)
  const bestSellersScrollRef = useRef(null)

  useEffect(() => {
    const fetchBrandsAndCategories = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          api.get('/brands'),
          api.get('/categories'),
        ])
        setBrands(brandsRes.data.filter((x) => x.status === 'active'))
        setCategories(categoriesRes.data.filter((x) => x.status === 'active'))
      } catch (error) {
        console.error('Error fetching brands/categories:', error)
      }
    }
    fetchBrandsAndCategories()
  }, [])

  useEffect(() => {
    api
      .get('/products/best-sellers?limit=10')
      .then((res) => {
        setBestSellers(res.data.data || [])
      })
      .catch(() => {})
  }, [])

  const bestSellerIdSet = useMemo(() => {
    const s = new Set()
    bestSellers.forEach(({ product: p }) => {
      if (p?.id) s.add(p.id)
    })
    return s
  }, [bestSellers])

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => setDebouncedSearch(search), 450)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [search])

  // Sync filters to URL (shareable links)
  useEffect(() => {
    const next = new URLSearchParams()
    if (debouncedSearch) next.set('search', debouncedSearch)
    if (filters.brand) next.set('brand', filters.brand)
    if (filters.category) next.set('category', filters.category)
    if (filters.size) next.set('size', filters.size)
    if (filters.color) next.set('color', filters.color)
    setSearchParams(next, { replace: true })
  }, [debouncedSearch, filters, setSearchParams])

  useEffect(() => {
    fetchProducts()
  }, [debouncedSearch, filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (debouncedSearch) params.append('search', debouncedSearch)
      if (filters.brand) params.append('brand', filters.brand)
      if (filters.category) params.append('category', filters.category)
      if (filters.size) params.append('size', filters.size)
      if (filters.color) params.append('color', filters.color)

      const response = await api.get(`/products?${params.toString()}`)
      setProducts(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollBestSellers = (direction) => {
    if (bestSellersScrollRef.current) {
      const scrollAmount = 320
      bestSellersScrollRef.current.scrollBy({
        left: direction === 'prev' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const clearFilters = () => {
    setFilters({ brand: '', category: '', size: '', color: '' })
    setSearch('')
    setDebouncedSearch('')
    setSearchParams(new URLSearchParams())
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-500 mb-2">
          Shop
        </p>
        <h1 className="font-display text-4xl font-bold text-zinc-100 tracking-tight">
          Footwear
        </h1>
        <p className="text-zinc-500 mt-2 max-w-2xl">
          Filter by size, brand, color, and shoe type. Search by name or keyword.
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <input
          type="search"
          placeholder="Search shoes, brands, materials…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3.5 text-zinc-100 placeholder-zinc-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 outline-none transition-shadow"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            value={filters.size}
            onChange={(e) =>
              setFilters({ ...filters, size: e.target.value })
            }
            className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:border-amber-500/60 outline-none"
          >
            <option value="">Size (US)</option>
            {SHOE_SIZES.map((sz) => (
              <option key={sz} value={sz}>
                {sz}
              </option>
            ))}
          </select>
          <select
            value={filters.brand}
            onChange={(e) =>
              setFilters({ ...filters, brand: e.target.value })
            }
            className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:border-amber-500/60 outline-none"
          >
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
          <select
            value={filters.color}
            onChange={(e) =>
              setFilters({ ...filters, color: e.target.value })
            }
            className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:border-amber-500/60 outline-none"
          >
            <option value="">All colors</option>
            {SHOE_COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:border-amber-500/60 outline-none"
          >
            <option value="">Shoe type</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="text-sm text-zinc-500 hover:text-amber-400 transition-colors"
        >
          Clear all filters
        </button>
      </div>

      <PromoCarousel />

      {bestSellers.length > 0 && (
        <section className="mt-4 mb-14 pt-10 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-zinc-100">
              Best sellers
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollBestSellers('prev')}
                className="rounded-lg border border-zinc-600 p-2 text-zinc-300 hover:bg-zinc-800 transition"
                aria-label="Previous"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollBestSellers('next')}
                className="rounded-lg border border-zinc-600 p-2 text-zinc-300 hover:bg-zinc-800 transition"
                aria-label="Next"
              >
                →
              </button>
            </div>
          </div>
          <div
            ref={bestSellersScrollRef}
            className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin"
            style={{ scrollBehavior: 'smooth' }}
          >
            {bestSellers.slice(0, 10).map(({ product: bestProduct, total_sold }) =>
              bestProduct ? (
                <Link
                  key={bestProduct.id}
                  to={`/products/${bestProduct.id}`}
                  className="group flex-shrink-0 w-44 rounded-2xl border border-zinc-700 bg-zinc-900/40 overflow-hidden hover:border-amber-500/40 transition"
                >
                  {bestProduct.image && (
                    <img
                      src={productImageUrl(bestProduct.image)}
                      alt={bestProduct.name}
                      className="h-44 w-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src =
                          'data:image/svg+xml,' +
                          encodeURIComponent(
                            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#27272a" width="100%" height="100%"/></svg>'
                          )
                      }}
                    />
                  )}
                  <div className="p-3">
                    <p className="font-semibold text-zinc-100 truncate text-sm group-hover:text-amber-400">
                      {bestProduct.name}
                    </p>
                    <p className="text-amber-400 font-bold">
                      ${bestProduct.price}
                    </p>
                    <p className="text-[11px] text-zinc-500">{total_sold} sold</p>
                  </div>
                </Link>
              ) : null
            )}
          </div>
        </section>
      )}

      {loading && products.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-zinc-700 border-t-amber-500" />
        </div>
      ) : (
        <>
          {loading && (
            <div className="flex justify-center items-center py-6 gap-3 text-zinc-500">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-zinc-700 border-t-amber-500" />
              <span>Updating…</span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product) => (
              <ShoeCard
                key={product.id}
                product={product}
                bestSellerIds={bestSellerIdSet}
              />
            ))}
          </div>

          {!loading && products.length === 0 && (
            <div className="text-center py-20 rounded-2xl border border-dashed border-zinc-700">
              <p className="text-zinc-500 text-lg">No shoes match those filters.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-amber-500 font-semibold hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Products
