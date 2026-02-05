import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Order #{order.order_number}
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Payment Status</h3>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                order.payment_status
              )}`}
            >
              {order.payment_status.toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Delivery Status</h3>
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
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p className="text-gray-600">{order.shipping_address}</p>
        </div>

        {order.phone && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Phone</h3>
            <p className="text-gray-600">{order.phone}</p>
          </div>
        )}

        {order.notes && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Notes</h3>
            <p className="text-gray-600">{order.notes}</p>
          </div>
        )}

        <div className="border-t pt-4">
          <p className="text-2xl font-bold text-right">
            Total: ${order.total_amount}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.order_items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center space-x-4">
                {item.product.image && (
                  <img
                    src={`http://localhost:8000/storage/${item.product.image}`}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600">
                    {item.selected_size && `Size: ${item.selected_size} `}
                    {item.selected_color && `Color: ${item.selected_color}`}
                  </p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
              </div>
              <p className="font-bold">
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

