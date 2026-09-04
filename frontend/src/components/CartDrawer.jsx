import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer({ open, onClose }) {
  const { cartItems, restaurantName, removeFromCart, updateQuantity, totalAmount, deliveryFee, grandTotal, totalItems } = useCart()
  const navigate = useNavigate()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 fade-in" onClick={onClose}></div>
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl slide-in flex flex-col">
        <div className="bg-primary text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">Your Cart</h2>
            {restaurantName && <p className="text-sm text-red-100">from {restaurantName}</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm">Add items to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item._id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                  <div className={`w-3 h-3 border-2 rounded-sm shrink-0 ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full m-0.5 ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                  </div>
                  <div className="flex items-center bg-white border rounded-lg overflow-hidden text-sm">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1 text-primary font-bold hover:bg-gray-100">-</button>
                    <span className="px-3 py-1 font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1 text-primary font-bold hover:bg-gray-100">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-green-600 text-sm font-medium">🎉 Free delivery on orders above ₹299</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Item Total</span><span className="font-medium">₹{totalAmount}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Delivery Fee</span><span className={`font-medium ${deliveryFee === 0 ? 'text-green-500' : ''}`}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
              <hr />
              <div className="flex justify-between text-lg font-bold"><span>Grand Total</span><span>₹{grandTotal}</span></div>
            </div>
            <button
              onClick={() => { onClose(); navigate('/cart') }}
              className="w-full bg-primary hover:bg-primaryDark text-white font-bold py-3 rounded-xl transition text-lg"
            >
              Proceed to Checkout ({totalItems} items)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
