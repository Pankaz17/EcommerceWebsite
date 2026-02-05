import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  })
  const [bestSellers, setBestSellers] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchBestSellers()
    fetchLowStock()
  }, [])

  const fetchStats = async () => {
    try {
      const ordersResponse = await api.get('/admin/orders?per_page=1000')
      const orders = ordersResponse.data.data || ordersResponse.data

      const productsResponse = await api.get('/products?per_page=1000')
      const products = productsResponse.data.data || productsResponse.data

      const totalRevenue = orders
        .filter((o) => o.payment_status === 'paid')
        .reduce((sum, o) => sum + parseFloat(o.total_amount), 0)

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(
          (o) => o.delivery_status === 'pending' || o.payment_status === 'pending'
        ).length,
        totalRevenue,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBestSellers = async () => {
    try {
      const res = await api.get('/products/best-sellers?limit=10')
      setBestSellers(res.data.data || [])
    } catch (error) {
      console.error('Error fetching best sellers:', error)
    }
  }

  const fetchLowStock = async () => {
    try {
      const res = await api.get('/admin/products/low-stock')
      setLowStockProducts(res.data.data || [])
    } catch (error) {
      console.error('Error fetching low stock:', error)
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
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Total Products
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalProducts}
          </p>
          <Link
            to="/admin/products"
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            Manage Products →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Total Orders
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalOrders}
          </p>
          <Link
            to="/admin/orders"
            className="text-green-600 hover:underline text-sm mt-2 inline-block"
          >
            View Orders →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Pending Orders
          </h3>
          <p className="text-3xl font-bold text-yellow-600">
            {stats.pendingOrders}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Inventory alerts: Low stock products */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 border-l-4 border-amber-500">
          <h2 className="text-2xl font-bold mb-4">Inventory Alerts – Low Stock</h2>
          <p className="text-sm text-gray-600 mb-4">Products with stock below 5 units.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lowStockProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{p.stock_quantity}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.is_out_of_stock ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                        {p.is_out_of_stock ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <Link to={`/admin/products/${p.id}/edit`} className="text-blue-600 hover:underline text-sm">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/admin/products" className="inline-block mt-3 text-blue-600 hover:underline text-sm font-medium">
            View all products →
          </Link>
        </div>
      )}

      {/* Sales analytics: Best Sellers widget */}
      {bestSellers.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Sales Analytics – Best Sellers (Top 10)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bestSellers.map(({ product, total_sold }, idx) => (
                  product && (
                    <tr key={product.id}>
                      <td className="px-4 py-2 text-sm text-gray-600">{idx + 1}</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{total_sold}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/products/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Add New Product
          </Link>
          <Link
            to="/admin/orders"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Manage Orders
          </Link>
          <Link
            to="/admin/brands"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Manage Brands
          </Link>
          <Link
            to="/admin/categories"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Manage Categories
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

