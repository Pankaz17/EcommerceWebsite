import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { productImageUrl } from '../utils/productImage'

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`)
      setOrder(response.data)
    } catch (error) {
      console.error('Error fetching order:', error)
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

  if (!order) {
    return (
      <div className="text-zinc-400 text-center py-12">
        Order not found
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-6 text-zinc-100">
        Order #{order.order_number}
      </h1>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold mb-2 text-zinc-300">Payment status</h3>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                order.payment_status
              )}`}
            >
              {order.payment_status.toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-zinc-300">Delivery status</h3>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                order.delivery_status
              )}`}
            >
              {order.delivery_status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-zinc-300">Shipping address</h3>
          <p className="text-zinc-400">{order.shipping_address}</p>
        </div>

        {order.phone && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-zinc-300">Phone</h3>
            <p className="text-zinc-400">{order.phone}</p>
          </div>
        )}

        {order.notes && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-zinc-300">Notes</h3>
            <p className="text-zinc-400">{order.notes}</p>
          </div>
        )}

        <div className="border-t pt-4">
          <p className="text-2xl font-bold text-right text-amber-400">
            Total: ${order.total_amount}
          </p>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6">
        <h2 className="font-display text-2xl font-bold mb-4 text-zinc-100">Items</h2>
        <div className="space-y-4">
          {order.order_items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-zinc-800 pb-4"
            >
              <div className="flex items-center space-x-4">
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
                  <h3 className="font-semibold text-zinc-100">{item.product.name}</h3>
                  <p className="text-zinc-500 text-sm">
                    {item.selected_size && `Size: ${item.selected_size} `}
                    {item.selected_color && `Color: ${item.selected_color}`}
                  </p>
                  <p className="text-zinc-500 text-sm">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-bold text-zinc-100">
                ${(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {order.status_history && order.status_history.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Status History</h2>
          <div className="space-y-2">
            {order.status_history.map((history) => (
              <div
                key={history.id}
                className="border-l-4 border-blue-500 pl-4 py-2"
              >
                <p className="font-semibold">
                  {history.status_type.toUpperCase()}: {history.old_status} →{' '}
                  {history.new_status}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(history.created_at).toLocaleString()}
                  {history.changed_by && (
                    <> by {history.changed_by.name}</>
                  )}
                </p>
                {history.notes && (
                  <p className="text-sm text-gray-500 mt-1">
                    {history.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetail

