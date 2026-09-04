import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })
  const [restaurantId, setRestaurantId] = useState(() => {
    return localStorage.getItem('cartRestaurantId') || null
  })
  const [restaurantName, setRestaurantName] = useState(() => {
    return localStorage.getItem('cartRestaurantName') || ''
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
    localStorage.setItem('cartRestaurantId', restaurantId || '')
    localStorage.setItem('cartRestaurantName', restaurantName || '')
  }, [cartItems, restaurantId, restaurantName])

  const addToCart = (item, restId, restName) => {
    if (restaurantId && restaurantId !== restId) {
      if (!window.confirm(`Your cart has items from ${restaurantName}. Clear cart and add from ${restName}?`)) return
      setCartItems([{ ...item, quantity: 1 }])
      setRestaurantId(restId)
      setRestaurantName(restName)
      return
    }

    setCartItems(prev => {
      const exists = prev.find(i => i._id === item._id)
      if (exists) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    setRestaurantId(restId)
    setRestaurantName(restName)
  }

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(i => i._id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCartItems(prev => prev.map(i => i._id === itemId ? { ...i, quantity } : i))
  }

  const clearCart = () => {
    setCartItems([])
    setRestaurantId(null)
    setRestaurantName('')
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = totalAmount > 299 ? 0 : 30
  const grandTotal = totalAmount + deliveryFee

  return (
    <CartContext.Provider value={{
      cartItems, restaurantId, restaurantName,
      addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalAmount, deliveryFee, grandTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}
