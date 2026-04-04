import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders')
      setOrders(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
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
      <h1 className="font-display text-3xl font-bold mb-6 text-zinc-100">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-zinc-700">
          <p className="text-zinc-500 text-lg mb-4">No orders yet</p>
          <Link
            to="/products"
            className="text-amber-500 hover:text-amber-400 font-semibold"
          >
            Shop shoes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 transition hover:border-amber-500/30 hover:-translate-y-0.5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-zinc-100">
                    #{order.order_number}
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-zinc-500 text-sm">
                    {order.order_items?.length || 0} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-400 mb-2">
                    ${order.total_amount}
                  </p>
                  <div className="space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.payment_status
                      )}`}
                    >
                      {order.payment_status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.delivery_status
                      )}`}
                    >
                      {order.delivery_status}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders

