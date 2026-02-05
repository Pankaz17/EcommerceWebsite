import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const { user, isAdmin } = useAuth()
  const [cartCount, setCartCount] = useState(0)

  const refreshCartCount = useCallback(async () => {
    if (!user || isAdmin) {
      setCartCount(0)
      return
    }
    try {
      const res = await api.get('/cart')
      const count = res.data?.cart_items?.length ?? 0
      setCartCount(count)
    } catch {
      setCartCount(0)
    }
  }, [user, isAdmin])

  useEffect(() => {
    refreshCartCount()
  }, [refreshCartCount])

  const value = {
    cartCount,
    refreshCartCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
