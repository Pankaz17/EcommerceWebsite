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
    <footer className="bg-slate-900 text-slate-200 mt-20 pt-16 pb-8">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 mb-12 pb-8 border-b border-slate-700">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Stay Updated</h3>
          <p className="text-slate-400 mb-6">
            Subscribe to our newsletter for exclusive offers, new arrivals, and styling tips on modest fashion.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="text-green-400 text-sm mt-2">Thank you for subscribing!</p>
          )}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div>
            <Link to="/" className="text-2xl font-bold text-blue-400 mb-4 inline-block">
              Modest Fashion
            </Link>
            <p className="text-slate-400 text-sm mb-6">
              Embracing modest elegance with premium Abayas, Hijabs, Pakistani Suits, and accessories for every occasion.
            </p>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-500 flex items-center justify-center transition text-slate-300 hover:text-white"
                  title="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                    <circle cx="12" cy="12" r="3.6" />
                    <circle cx="5.5" cy="5.5" r="1.6" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-500 flex items-center justify-center transition text-slate-300 hover:text-white"
                  title="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-500 flex items-center justify-center transition text-slate-300 hover:text-white"
                  title="TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v4.26a2.85 2.85 0 0 1-5.45 0V2H4.38v4.44A4.84 4.84 0 0 0 8.98 11.5v6.2a2.85 2.85 0 0 1-5.7 0v-3.1a4.86 4.86 0 0 1-3.28-4.54V2H.38v6.66a8 8 0 0 0 8 8.09v-4.42a4.83 4.83 0 0 0 3.28-4.23v-5.3h3.68v1.02a2.84 2.84 0 0 1-2.77 2.77v3.1a8 8 0 0 0 7.56-8.04V2h-3.7z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-500 flex items-center justify-center transition text-slate-300 hover:text-white"
                  title="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/products?category=abayas" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Abayas
                </Link>
              </li>
              <li>
                <Link to="/products?category=hijabs" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Hijabs
                </Link>
              </li>
              <li>
                <Link to="/products?category=suits" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Pakistani Suits
                </Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <a href="#contact" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#shipping" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Shipping Information
                </a>
              </li>
              <li>
                <a href="#returns" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#size-guide" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Information</h4>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Email: info@modestfashion.com
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-blue-400 transition text-sm">
                  Phone: +1 (555) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-slate-700 pt-8 mb-8">
          <p className="text-center text-xs uppercase tracking-wider text-slate-500 mb-4">We Accept</p>
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <div className="flex items-center justify-center w-12 h-8 bg-slate-800 rounded px-2">
              <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#1434CB" />
                <circle cx="18" cy="16" r="8" fill="none" stroke="#FFA200" strokeWidth="2" />
                <circle cx="30" cy="16" r="8" fill="none" stroke="#EB001B" strokeWidth="2" />
              </svg>
            </div>
            <div className="flex items-center justify-center w-12 h-8 bg-slate-800 rounded px-2">
              <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#003366" />
                <path d="M12 20L18 12L24 20M28 12L32 18L36 12" stroke="#FFC439" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex items-center justify-center w-12 h-8 bg-slate-800 rounded px-2">
              <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="white" />
                <text x="24" y="20" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#0066B2">AmEx</text>
              </svg>
            </div>
            <span className="text-slate-400 text-sm">+ PayPal & Apple Pay</span>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Modest Fashion. All rights reserved. | Designed with elegance for modest fashion enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
