import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    payment_status: '',
    delivery_status: '',
  })

  useEffect(() => {
    fetchOrders()
  }, [filters])

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.payment_status) {
        params.append('payment_status', filters.payment_status)
      }
      if (filters.delivery_status) {
        params.append('delivery_status', filters.delivery_status)
      }

      const response = await api.get(
        `/admin/orders?${params.toString()}`
      )
      setOrders(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/payment-status`, {
        payment_status: status,
      })
      fetchOrders()
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating status')
    }
  }

  const updateDeliveryStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/delivery-status`, {
        delivery_status: status,
      })
      fetchOrders()
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating status')
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

      <div className="mb-6 flex space-x-4">
        <select
          value={filters.payment_status}
          onChange={(e) =>
            setFilters({ ...filters, payment_status: e.target.value })
          }
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Payment Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <select
          value={filters.delivery_status}
          onChange={(e) =>
            setFilters({ ...filters, delivery_status: e.target.value })
          }
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Delivery Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <Link
                  to={`/admin/orders/${order.id}`}
                  className="text-xl font-semibold hover:text-blue-600"
                >
                  Order #{order.order_number}
                </Link>
                <p className="text-gray-600">
                  Customer: {order.user?.name} ({order.user?.email})
                </p>
                <p className="text-gray-600">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  ${order.total_amount}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold mb-2">
                  Payment Status
                </label>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.payment_status
                    )}`}
                  >
                    {order.payment_status}
                  </span>
                  <select
                    value={order.payment_status}
                    onChange={(e) =>
                      updatePaymentStatus(order.id, e.target.value)
                    }
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Delivery Status
                </label>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.delivery_status
                    )}`}
                  >
                    {order.delivery_status}
                  </span>
                  <select
                    value={order.delivery_status}
                    onChange={(e) =>
                      updateDeliveryStatus(order.id, e.target.value)
                    }
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                {order.order_items?.length || 0} item(s)
              </p>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      )}
    </div>
  )
}

export default AdminOrders

