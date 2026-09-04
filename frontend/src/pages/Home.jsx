import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import RestaurantCard from '../components/RestaurantCard'

const foodCategories = [
  { name: 'Biryani', icon: '🍚', color: 'bg-amber-50', link: '/restaurants?cuisine=Biryani' },
  { name: 'Pizza', icon: '🍕', color: 'bg-orange-50', link: '/restaurants?cuisine=Pizza' },
  { name: 'Dosa', icon: '🫓', color: 'bg-yellow-50', link: '/restaurants?cuisine=Dosa' },
  { name: 'Chinese', icon: '🥡', color: 'bg-red-50', link: '/restaurants?cuisine=Chinese' },
  { name: 'Burger', icon: '🍔', color: 'bg-amber-50', link: '/restaurants?cuisine=Burger' },
  { name: 'Sushi', icon: '🍣', color: 'bg-pink-50', link: '/restaurants?cuisine=Sushi' },
  { name: 'Tandoori', icon: '🍗', color: 'bg-orange-50', link: '/restaurants?cuisine=Tandoori' },
  { name: 'South Indian', icon: '🍛', color: 'bg-green-50', link: '/restaurants?cuisine=South Indian' },
  { name: 'Street Food', icon: '🌮', color: 'bg-yellow-50', link: '/restaurants?cuisine=Street Food' },
  { name: 'Desserts', icon: '🍰', color: 'bg-pink-50', link: '/restaurants?cuisine=Desserts' },
  { name: 'Rolls', icon: '🌯', color: 'bg-green-50', link: '/restaurants?cuisine=Rolls' },
  { name: 'Thali', icon: '🍽️', color: 'bg-blue-50', link: '/restaurants?cuisine=Thali' }
]

export default function Home() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/restaurants').then(res => {
      setRestaurants(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">Hungry? We've got you!</h1>
          <p className="text-lg md:text-xl text-red-100 mb-6">Order food from the best restaurants in your city</p>
          <div className="flex items-center bg-white rounded-xl overflow-hidden max-w-xl shadow-lg">
            <div className="flex-1 flex items-center gap-2 px-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input type="text" placeholder="Enter your delivery location" className="py-4 text-gray-700 text-sm w-full focus:outline-none" />
            </div>
            <button className="bg-primary hover:bg-primaryDark text-white font-semibold px-8 py-4 transition">Find Food</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">What's on your mind?</h2>
            <p className="text-gray-500 text-sm">Explore food categories</p>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {foodCategories.map((cat, i) => (
            <Link key={i} to={cat.link} className={`${cat.color} rounded-2xl p-4 text-center hover:scale-105 transition-transform cursor-pointer group`}>
              <span className="text-4xl block mb-2">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 mx-4 md:mx-auto max-w-7xl rounded-2xl p-6 md:p-8 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between text-white gap-4">
          <div>
            <h3 className="text-2xl font-bold mb-1">🎉 Flat 50% OFF up to ₹150</h3>
            <p className="text-green-100">Use code FOODIE50 on your first order. Minimum order ₹199.</p>
          </div>
          <button className="bg-white text-green-600 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition shrink-0">Order Now</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Top restaurants near you</h2>
            <p className="text-gray-500 text-sm">Curated for the best dining experience</p>
          </div>
          <Link to="/restaurants" className="text-primary font-medium text-sm hover:underline">See all →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.slice(0, 8).map(r => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Why order from FoodieHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Lightning Fast</h4>
              <p className="text-gray-500 text-sm">Get your food delivered in under 30 minutes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Best Restaurants</h4>
              <p className="text-gray-500 text-sm">Partnered with top-rated restaurants in your city</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Best Deals</h4>
              <p className="text-gray-500 text-sm">Exclusive offers and discounts every day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
