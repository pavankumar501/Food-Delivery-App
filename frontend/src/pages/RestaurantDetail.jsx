import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import MenuItemCard from '../components/MenuItemCard'
import CartDrawer from '../components/CartDrawer'
import { useCart } from '../context/CartContext'

export default function RestaurantDetail() {
  const { slug } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cartOpen, setCartOpen] = useState(false)
  const { totalItems } = useCart()

  useEffect(() => {
    Promise.all([
      axios.get(`/api/restaurants/${slug}`),
      axios.get(`/api/restaurants/${slug}/menu`)
    ]).then(([restRes, menuRes]) => {
      setRestaurant(restRes.data)
      setMenuItems(menuRes.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  const categories = ['All', ...new Set(menuItems.map(i => i.category))]
  const filteredItems = selectedCategory === 'All' ? menuItems : menuItems.filter(i => i.category === selectedCategory)

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gray-200 rounded-2xl h-64 animate-pulse mb-6"></div>
      <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="bg-gray-200 rounded-xl h-32 animate-pulse"></div>)}</div>
    </div>
  )

  if (!restaurant) return <div className="text-center py-20 text-gray-400">Restaurant not found</div>

  return (
    <div>
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop'} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm">
              <div className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                ★ {restaurant.rating}
              </div>
              <span>({restaurant.reviewCount}+ ratings)</span>
              <span>•</span>
              <span>{restaurant.deliveryTime}</span>
              <span>•</span>
              <span>₹{restaurant.minOrder} for two</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {restaurant.cuisine?.map((c, i) => (
                <span key={i} className="text-white/70 text-sm">{c}{i < restaurant.cuisine.length - 1 ? ' • ' : ''}</span>
              ))}
            </div>
            {restaurant.offers && restaurant.offers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {restaurant.offers.map((offer, i) => (
                  <span key={i} className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">🏷️ {offer}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 mb-6 border-b sticky top-16 bg-white z-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap py-2 px-4 text-sm font-medium transition border-b-2 ${
                selectedCategory === cat ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No items in this category</p>
          ) : (
            filteredItems.map(item => (
              <MenuItemCard key={item._id} item={item} restaurantId={restaurant._id} restaurantName={restaurant.name} />
            ))
          )}
        </div>
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-white p-4 shadow-2xl z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <span className="font-bold">{totalItems} items | ₹{useCart().totalAmount}</span>
              <span className="text-red-200 text-sm ml-2">+ delivery fee</span>
            </div>
            <button onClick={() => setCartOpen(true)} className="bg-white text-primary font-bold px-6 py-2 rounded-xl hover:bg-gray-100 transition">
              View Cart
            </button>
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
