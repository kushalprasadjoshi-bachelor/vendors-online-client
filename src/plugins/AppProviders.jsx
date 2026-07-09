import { useCallback, useMemo, useState } from 'react'
import { createCartItemDto, createCartSummaryDto } from '../dtos'
import { authService } from '../services/authService'
import { storage } from '../utils/storage'
import { AuthContext } from './authContext'
import { CartContext } from './cartContext'

const cartKey = 'vendors_online_cart'

const lineKey = (item) => `${item.productId}-${item.color}-${item.size}`

const AppProviders = ({ children }) => {
  const [user, setUser] = useState(() => storage.get('vendors_online_user'))
  const [cartItems, setCartItems] = useState(() => storage.get(cartKey, []))

  const persistCart = useCallback((items) => {
    setCartItems(items)
    storage.set(cartKey, items)
  }, [])

  const addToCart = useCallback((payload) => {
    const item = createCartItemDto(payload)
    const nextItems = [...cartItems]
    const existingIndex = nextItems.findIndex((cartItem) => lineKey(cartItem) === lineKey(item))

    if (existingIndex >= 0) {
      nextItems[existingIndex] = {
        ...nextItems[existingIndex],
        quantity: nextItems[existingIndex].quantity + item.quantity,
      }
    } else {
      nextItems.push(item)
    }

    persistCart(nextItems)
  }, [cartItems, persistCart])

  const updateQuantity = useCallback((key, quantity) => {
    const nextItems = cartItems
      .map((item) => (lineKey(item) === key ? { ...item, quantity: Math.max(1, quantity) } : item))

    persistCart(nextItems)
  }, [cartItems, persistCart])

  const removeFromCart = useCallback((key) => {
    persistCart(cartItems.filter((item) => lineKey(item) !== key))
  }, [cartItems, persistCart])

  const clearCart = useCallback(() => persistCart([]), [persistCart])

  const login = async (dto) => {
    const result = await authService.login(dto)
    setUser(result.user)
    return result
  }

  const register = async (dto) => {
    const result = await authService.register(dto)
    setUser(result.user)
    return result
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const authValue = useMemo(() => ({
    user,
    login,
    register,
    logout,
  }), [user])

  const cartValue = useMemo(() => ({
    items: cartItems,
    count: cartItems.reduce((total, item) => total + item.quantity, 0),
    summary: createCartSummaryDto({ items: cartItems }),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    lineKey,
  }), [addToCart, cartItems, clearCart, removeFromCart, updateQuantity])

  return (
    <AuthContext.Provider value={authValue}>
      <CartContext.Provider value={cartValue}>
        {children}
      </CartContext.Provider>
    </AuthContext.Provider>
  )
}

export default AppProviders
