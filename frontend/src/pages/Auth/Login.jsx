import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.email, formData.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl px-8 pt-8 pb-8 shadow-xl">
        <h2 className="font-display text-2xl font-bold mb-6 text-center text-zinc-100">
          Sign in
        </h2>
        {error && (
          <div className="bg-red-950/80 border border-red-900 text-red-300 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-zinc-400 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 focus:border-amber-500/50 outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-zinc-400 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 focus:border-amber-500/50 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-zinc-950 font-semibold py-3 px-4 rounded-xl hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">
          No account?{' '}
          <Link to="/register" className="text-amber-500 hover:text-amber-400 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
