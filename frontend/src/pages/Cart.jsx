import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Cart() {
  const { cartItems, restaurantName, totalAmount, deliveryFee, grandTotal, removeFromCart, updateQuantity, clearCart } = useCart()
  const { user, authHeaders } = useAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const placeOrder = async () => {
    if (!user) { navigate('/login'); return }
    if (!address.street || !address.city || !address.pincode) { alert('Please fill delivery address'); return }
    setLoading(true)
    try {
      await axios.post('/api/orders', {
        restaurant: cartItems[0]?._id ? (await axios.get(`/api/restaurants?search=${restaurantName}`)).data[0]?._id : null,
        items: cartItems.map(i => ({ menuItem: i._id, name: i.name, quantity: i.quantity, price: i.price })),
        deliveryAddress: address,
        paymentMethod,
        totalAmount,
        deliveryFee,
        finalAmount: grandTotal
      }, { headers: authHeaders })
      clearCart()
      setOrderPlaced(true)
    } catch (err) {
      alert('Failed to place order. Please try again.')
    }
    setLoading(false)
  }

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-6">Your delicious food is on its way. Track your order below.</p>
        <Link to="/my-orders" className="bg-primary hover:bg-primaryDark text-white font-bold px-8 py-3 rounded-xl transition inline-block">
          View My Orders
        </Link>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
        <Link to="/restaurants" className="bg-primary hover:bg-primaryDark text-white font-bold px-8 py-3 rounded-xl transition inline-block">
          Browse Restaurants
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Delivery Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" placeholder="Street Address" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="text" placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="text" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} className="px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[{ id: 'cod', label: 'Cash on Delivery', icon: '💵' }, { id: 'upi', label: 'UPI Payment', icon: '📱' }, { id: 'card', label: 'Credit/Debit Card', icon: '💳' }].map(m => (
                <label key={m.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === m.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={e => setPaymentMethod(e.target.value)} className="text-primary" />
                  <span className="text-xl">{m.icon}</span>
                  <span className="font-medium text-sm">{m.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Your Items from {restaurantName}</h2>
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item._id} className="flex items-center gap-3">
                  <div className={`w-3 h-3 border-2 rounded-sm shrink-0 ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full m-0.5 ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                  <span className="flex-1 text-sm font-medium">{item.name}</span>
                  <div className="flex items-center border rounded-lg overflow-hidden text-sm">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1 text-primary font-bold hover:bg-gray-100">-</button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1 text-primary font-bold hover:bg-gray-100">+</button>
                  </div>
                  <span className="font-medium text-sm w-16 text-right">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="font-bold text-gray-800 mb-4">Bill Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Item Total</span><span>₹{totalAmount}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Delivery Fee</span><span className={deliveryFee === 0 ? 'text-green-500 font-medium' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Taxes & Charges</span><span>₹0</span></div>
              <hr />
              <div className="flex justify-between text-lg font-bold"><span>To Pay</span><span>₹{grandTotal}</span></div>
            </div>
            <button
              onClick={placeOrder}
              disabled={loading}
              className="w-full bg-primary hover:bg-primaryDark text-white font-bold py-3 rounded-xl transition mt-4 disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : `Place Order • ₹${grandTotal}`}
            </button>
            {!user && (
              <p className="text-center text-xs text-gray-400 mt-2">
                <Link to="/login" className="text-primary underline">Login</Link> to place order
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
