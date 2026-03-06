import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useCart } from '../contexts/CartContext'

const Cart = () => {
  const navigate = useNavigate()
  const { refreshCartCount } = useCart()
  const [cart, setCart] = useState({ cart_items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] = useState({
    shipping_address: '',
    phone: '',
    notes: '',
    payment_method: 'cod',
  })
  const [showCheckout, setShowCheckout] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart')
      setCart(response.data)
      refreshCartCount()
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return
    try {
      await api.put(`/cart/${id}`, { quantity })
      fetchCart()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating cart')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`)
      fetchCart()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error removing item')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('/orders', orderData)
      setMessage('Order placed successfully!')
      setShowCheckout(false)
      fetchCart()
      setTimeout(() => {
        navigate(`/orders/${response.data.order.id}`)
      }, 2000)
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Error placing order'
      )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

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

      {cart.cart_items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="text-blue-600 hover:underline font-semibold"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            {cart.cart_items.map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-200 p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {item.product.image && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${item.product.image}`}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                          console.warn('Image failed to load:', e.target.src)
                          e.target.onerror = null
                          const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-size="10" fill="#9ca3af" dominant-baseline="middle" text-anchor="middle">Image unavailable</text></svg>'
                          e.target.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
                        }}
                    />
                  )}
                  <div>
                    <Link
                      to={`/products/${item.product.id}`}
                      className="font-semibold text-lg hover:text-blue-600"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-gray-600">
                      {item.selected_size && `Size: ${item.selected_size} `}
                      {item.selected_color && `Color: ${item.selected_color}`}
                    </p>
                    <p className="text-blue-600 font-bold">
                      ${item.product.price} each
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 px-3 py-1 rounded"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 px-3 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-bold w-24 text-right">
                    ${(item.quantity * item.product.price).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${cart.total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>

          {showCheckout && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-4">Checkout</h2>
                <form onSubmit={handleCheckout}>
                  <div className="mb-4">
                    <label className="block font-semibold mb-2">
                      Shipping Address *
                    </label>
                    <textarea
                      value={orderData.shipping_address}
                      onChange={(e) =>
                        setOrderData({
                          ...orderData,
                          shipping_address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                      rows="3"
                    />
                  </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-2">
                    Payment Method *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        checked={orderData.payment_method === 'cod'}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            payment_method: e.target.value,
                          })
                        }
                      />
                      <span>Cash on Delivery</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="payment_method"
                        value="dummy"
                        checked={orderData.payment_method === 'dummy'}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            payment_method: e.target.value,
                          })
                        }
                      />
                      <span>Dummy Online Payment (test)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="payment_method"
                        value="esewa"
                        checked={orderData.payment_method === 'esewa'}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            payment_method: e.target.value,
                          })
                        }
                      />
                      <span>eSewa (simulated)</span>
                    </label>
                  </div>
                </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={orderData.phone}
                      onChange={(e) =>
                        setOrderData({ ...orderData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-2">Notes</label>
                    <textarea
                      value={orderData.notes}
                      onChange={(e) =>
                        setOrderData({ ...orderData, notes: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows="2"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Cart

