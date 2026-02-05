import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import OfferBanner from '../components/OfferBanner'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
  })
  const debounceTimer = useRef(null)

  // Fetch brands and categories on mount
  useEffect(() => {
    const fetchBrandsAndCategories = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          api.get('/brands'),
          api.get('/categories'),
        ])
        setBrands(brandsRes.data.filter((b) => b.status === 'active'))
        setCategories(categoriesRes.data.filter((c) => c.status === 'active'))
      } catch (error) {
        console.error('Error fetching brands/categories:', error)
      }
    }
    fetchBrandsAndCategories()
  }, [])

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500) // Wait 500ms after user stops typing

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [search])

  // Fetch products when debouncedSearch or filters change
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

      const response = await api.get(`/products?${params.toString()}`)
      setProducts(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="mb-6 space-y-4 md:flex md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={filters.brand}
          onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Offer Banner - Auto-sliding */}
      <OfferBanner />

      {loading && products.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {loading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white/95 rounded-2xl shadow-lg overflow-hidden transition-transform transition-shadow duration-200 hover:shadow-2xl hover:-translate-y-1"
              >
                {product.image && (
                  <img
                    src={`http://localhost:8000/storage/${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                  <p className="text-blue-600 font-bold text-xl">
                    ${product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Products

