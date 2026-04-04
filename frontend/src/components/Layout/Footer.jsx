import { useState } from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-zinc-950 text-zinc-300 mt-24 pt-16 pb-10 border-t border-zinc-800">
      <div className="container mx-auto px-4 mb-12 pb-10 border-b border-zinc-800">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-display text-2xl font-bold text-white mb-3">
            First to know about drops
          </h3>
          <p className="text-zinc-500 mb-6 text-sm">
            Restocks, limited colorways, and release dates — no spam.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 text-white placeholder-zinc-600 border border-zinc-800 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-amber-500 text-zinc-950 font-semibold rounded-xl hover:bg-amber-400 transition-colors"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="text-emerald-400 text-sm mt-3">You&apos;re on the list.</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="font-display text-2xl font-bold text-white mb-4 inline-block">
              Stride<span className="text-amber-500">Lab</span>
            </Link>
            <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
              A focused footwear shop: runners, sneakers, casual pairs, and boots — built on the same cart, orders, and eSewa flow you already use.
            </p>
            <p className="text-xs uppercase tracking-widest text-zinc-600 mb-3">Social</p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 flex items-center justify-center text-zinc-400 hover:text-amber-400 transition-colors"
                title="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                  <circle cx="12" cy="12" r="3.6" />
                  <circle cx="5.5" cy="5.5" r="1.6" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4 font-display">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/products" className="text-zinc-500 hover:text-amber-400 transition-colors">
                  All shoes
                </Link>
              </li>
              <li>
                <Link to="/products?category=Running" className="text-zinc-500 hover:text-amber-400 transition-colors">
                  Running
                </Link>
              </li>
              <li>
                <Link to="/products?category=Sneakers" className="text-zinc-500 hover:text-amber-400 transition-colors">
                  Sneakers
                </Link>
              </li>
              <li>
                <Link to="/products?category=Casual" className="text-zinc-500 hover:text-amber-400 transition-colors">
                  Casual
                </Link>
              </li>
              <li>
                <Link to="/products?category=Boots" className="text-zinc-500 hover:text-amber-400 transition-colors">
                  Boots
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4 font-display">Help</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><span className="hover:text-amber-400 cursor-default">Contact</span></li>
              <li><span className="hover:text-amber-400 cursor-default">Shipping</span></li>
              <li><span className="hover:text-amber-400 cursor-default">Returns</span></li>
              <li><span className="hover:text-amber-400 cursor-default">Size guide</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4 font-display">Info</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li>Email: hello@stridelab.store</li>
              <li>Payments: cards, wallets, eSewa at checkout</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 text-center">
          <p className="text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} StrideLab. Lace up.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
