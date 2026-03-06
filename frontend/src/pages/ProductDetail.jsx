import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import api from '../services/api'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refreshCartCount } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [message, setMessage] = useState('')

  const parseSizes = (raw) => {
    if (!raw && raw !== 0) return []
    if (Array.isArray(raw)) return raw
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch (e) {
      if (typeof raw === 'string') {
        return raw.includes(',') ? raw.split(',').map((s) => s.trim()) : [raw]
      }
      return [String(raw)]
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`)
      setProduct(response.data)
      const sizes = parseSizes(response.data.size)
      if (sizes.length > 0) {
        setSelectedSize(sizes[0])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      await api.post('/cart', {
        product_id: product.id,
        quantity,
        selected_size: selectedSize,
        selected_color: selectedColor,
      })
      refreshCartCount()
      setMessage('Product added to cart!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding to cart')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return <div>Product not found</div>
  }

  const sizes = parseSizes(product.size)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {product.image && (
              <img
                src={`http://127.0.0.1:8000/storage/${product.image}`}
                alt={product.name}
                className="w-full rounded-lg shadow-lg"
                onError={(e) => {
                  console.warn('Image failed to load:', e.target.src)
                  e.target.onerror = null
                  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-size="24" fill="#9ca3af" dominant-baseline="middle" text-anchor="middle">Image unavailable</text></svg>'
                  e.target.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
                }}
              />
          )}
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-blue-600 font-bold mb-4">
            ${product.price}
          </p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="mb-4">
            <p className="font-semibold">Brand: {product.brand}</p>
            <p className="font-semibold">Category: {product.category}</p>
            <p className="font-semibold">
              Stock: {product.stock_quantity} available
            </p>
          </div>

          {sizes.length > 0 && (
            <div className="mb-4">
              <label className="block font-semibold mb-2">Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          {product.color && (
            <div className="mb-4">
              <label className="block font-semibold mb-2">Color</label>
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                placeholder={product.color}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block font-semibold mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              max={product.stock_quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded ${
                message.includes('Error')
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {message}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {product.stock_quantity === 0
              ? 'Out of Stock'
              : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* You May Also Like - Product recommendations */}
      {product.recommendations && product.recommendations.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {product.recommendations.map((rec) => (
              <Link
                key={rec.id}
                to={`/products/${rec.id}`}
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition"
              >
                  {rec.image && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${rec.image}`}
                      alt={rec.name}
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
                  <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600">
                    {rec.name}
                  </p>
                  <p className="text-blue-600 font-bold">${rec.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default ProductDetail

