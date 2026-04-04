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
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-900/40 group-hover:shadow-amber-500/30 transition-shadow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-6 h-6 text-zinc-950"
                aria-hidden
              >
                <path
                  d="M4 14c2-4 6-6 10-6 2 0 4 .5 5.5 1.5M4 18c3-3 7-4.5 11-4.5 1.5 0 3 .2 4.5.7M6 10l2-4h8l2 4"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight">
              <span className="text-white">Stride</span>
              <span className="text-amber-500">Lab</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/products"
              className="text-zinc-400 hover:text-amber-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Shop
            </Link>

            {user ? (
              <>
                {!isAdmin && (
                  <>
                    <Link
                      to="/cart"
                      className="relative flex items-center px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-amber-400 transition-colors"
                    >
                      <span className="relative inline-flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-6 w-6"
                        >
                          <path d="M7.5 4.5a1 1 0 0 1 1-1h.764a2 2 0 0 1 1.789 1.106l.447.894H19a1 1 0 0 1 .96 1.279l-1.8 6A2 2 0 0 1 16.24 14.5H10a2 2 0 0 1-1.94-1.514L6.08 5.5H4.5a1 1 0 1 1 0-2h2.056A1 1 0 0 1 7.5 4.5Z" />
                          <path d="M10 16.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Zm6.25 1.75A1.75 1.75 0 1 1 14.5 20a1.75 1.75 0 0 1 1.75-1.75Z" />
                        </svg>
                        <span className="absolute -top-2 -right-2 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-zinc-950">
                          {cartCount ?? 0}
                        </span>
                      </span>
                    </Link>
                    <Link
                      to="/orders"
                      className="text-zinc-400 hover:text-amber-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors hidden sm:inline"
                    >
                      Orders
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className="text-zinc-400 hover:text-amber-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/products"
                      className="text-zinc-400 hover:text-amber-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors hidden sm:inline"
                    >
                      Stock
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="text-zinc-400 hover:text-amber-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors hidden md:inline"
                    >
                      Orders
                    </Link>
                  </>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
                  <span className="text-zinc-500 text-sm max-w-[100px] truncate hidden sm:inline">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-zinc-800 text-zinc-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-zinc-700 border border-zinc-700"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-zinc-400 hover:text-amber-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-500 text-zinc-950 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-400 transition-colors"
                >
                  Join
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
