import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useCart } from '../contexts/CartContext'
import { productImageUrl } from '../utils/productImage'

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
      const createdOrder = response.data.order

      // If payment method is eSewa, initiate real sandbox payment flow
      if (orderData.payment_method === 'esewa') {
        const initRes = await api.post(
          `/payment/esewa/initiate/${createdOrder.id}`
        )

        const { payment_url: paymentUrl, params } = initRes.data || {}

        if (!paymentUrl || !params) {
          throw new Error('Unable to initiate eSewa payment.')
        }

        // Create a form and submit via POST to eSewa sandbox
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = paymentUrl

        Object.entries(params).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value
          form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
        return
      }

      // Default flow for COD and dummy payment
      setMessage('Order placed successfully!')
      setShowCheckout(false)
      fetchCart()
      setTimeout(() => {
        navigate(`/orders/${createdOrder.id}`)
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
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-zinc-700 border-t-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-6 text-zinc-100">Cart</h1>

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
        <div className="text-center py-12 rounded-2xl border border-dashed border-zinc-700">
          <p className="text-zinc-500 text-lg mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="text-amber-500 hover:text-amber-400 font-semibold"
          >
            Browse shoes
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden mb-6">
            {cart.cart_items.map((item) => (
              <div
                key={item.id}
                className="border-b border-zinc-800 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {item.product.image && (
                    <img
                      src={productImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
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
                      className="font-semibold text-lg text-zinc-100 hover:text-amber-400"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-zinc-500 text-sm">
                      {item.selected_size && `Size: ${item.selected_size} `}
                      {item.selected_color && `Color: ${item.selected_color}`}
                    </p>
                    <p className="text-amber-400 font-bold">
                      ${item.product.price} each
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-zinc-800 text-zinc-200 px-3 py-1 rounded-lg border border-zinc-700"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-zinc-200">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-zinc-800 text-zinc-200 px-3 py-1 rounded-lg border border-zinc-700"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-bold w-24 text-right text-zinc-100">
                    ${(item.quantity * item.product.price).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-zinc-100">Total</span>
              <span className="text-2xl font-bold text-amber-400">
                ${cart.total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-amber-500 text-zinc-950 px-6 py-3 rounded-xl font-semibold hover:bg-amber-400"
            >
              Proceed to Checkout
            </button>
          </div>

          {showCheckout && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="font-display text-2xl font-bold mb-4 text-zinc-100">Checkout</h2>
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
                      className="w-full px-4 py-2 border border-zinc-700 rounded-xl bg-zinc-950 text-zinc-100"
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
                      className="w-full px-4 py-2 border border-zinc-700 rounded-xl bg-zinc-950 text-zinc-100"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-2">Notes</label>
                    <textarea
                      value={orderData.notes}
                      onChange={(e) =>
                        setOrderData({ ...orderData, notes: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-zinc-700 rounded-xl bg-zinc-950 text-zinc-100"
                      rows="2"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 bg-zinc-800 text-zinc-200 px-4 py-2 rounded-xl font-semibold hover:bg-zinc-700 border border-zinc-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-amber-500 text-zinc-950 px-4 py-2 rounded-xl font-semibold hover:bg-amber-400"
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

