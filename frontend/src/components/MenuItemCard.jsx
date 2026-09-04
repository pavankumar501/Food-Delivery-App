import { useCart } from '../context/CartContext'

export default function MenuItemCard({ item, restaurantId, restaurantName }) {
  const { cartItems, addToCart, updateQuantity } = useCart()
  const cartItem = cartItems.find(i => i._id === item._id)
  const quantity = cartItem?.quantity || 0

  return (
    <div className="bg-white rounded-xl p-4 flex gap-4 border border-gray-100 hover:shadow-md transition">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
            <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          {item.isBestseller && (
            <span className="text-amber-500 text-xs font-bold flex items-center gap-1">
              ★ Bestseller
            </span>
          )}
        </div>
        <h4 className="font-semibold text-gray-800">{item.name}</h4>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="font-bold text-gray-800">₹{item.price}</span>
          {item.spicyLevel > 0 && (
            <span className="text-xs text-orange-500">
              {'🌶️'.repeat(item.spicyLevel)}
            </span>
          )}
        </div>
      </div>

      <div className="relative shrink-0">
        <img
          src={item.image || `https://images.unsplash.com/${item.isVeg ? 'photo-1631452180519-c014fe946bc7' : 'photo-1565299624946-b28f40a0ae38'}?w=200&h=200&fit=crop`}
          alt={item.name}
          className="w-28 h-28 rounded-xl object-cover"
        />
        {!item.isAvailable ? (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
            <span className="text-white text-xs font-bold">Not Available</span>
          </div>
        ) : quantity === 0 ? (
          <button
            onClick={() => addToCart(item, restaurantId, restaurantName)}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border-2 border-primary text-primary font-bold px-6 py-1.5 rounded-lg text-sm hover:bg-primary hover:text-white transition shadow-md"
          >
            ADD
          </button>
        ) : (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-white font-bold rounded-lg text-sm flex items-center overflow-hidden shadow-md">
            <button onClick={() => updateQuantity(item._id, quantity - 1)} className="px-3 py-1.5 hover:bg-primaryDark transition">-</button>
            <span className="px-3 py-1.5">{quantity}</span>
            <button onClick={() => updateQuantity(item._id, quantity + 1)} className="px-3 py-1.5 hover:bg-primaryDark transition">+</button>
          </div>
        )}
      </div>
    </div>
  )
}
