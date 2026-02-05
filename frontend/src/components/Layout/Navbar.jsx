import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Logo icon – stylized M for Modest */}
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 shadow-md shadow-blue-500/30 group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-shadow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M5 19V9l7 6 7-6v10M5 9l7 6 7-6" />
              </svg>
            </span>
            <span className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 group-hover:from-blue-700 group-hover:via-cyan-600 group-hover:to-teal-700 transition-all duration-300">
                Modest
              </span>
              <span className="text-slate-700 font-semibold"> Fashion</span>
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Products
            </Link>

            {user ? (
              <>
                {!isAdmin && (
                  <>
                    <Link
                      to="/cart"
                      className="relative flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      <span className="relative inline-flex">
                        {/* Cart icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-6 w-6"
                        >
                          <path d="M7.5 4.5a1 1 0 0 1 1-1h.764a2 2 0 0 1 1.789 1.106l.447.894H19a1 1 0 0 1 .96 1.279l-1.8 6A2 2 0 0 1 16.24 14.5H10a2 2 0 0 1-1.94-1.514L6.08 5.5H4.5a1 1 0 1 1 0-2h2.056A1 1 0 0 1 7.5 4.5Z" />
                          <path d="M10 16.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Zm6.25 1.75A1.75 1.75 0 1 1 14.5 20a1.75 1.75 0 0 1 1.75-1.75Z" />
                        </svg>

                        {/* Count badge */}
                        <span className="absolute -top-2 -right-2 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                          {cartCount ?? 0}
                        </span>
                      </span>
                    </Link>
                    <Link
                      to="/orders"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Orders
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/products"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Products
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Orders
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 text-sm">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

