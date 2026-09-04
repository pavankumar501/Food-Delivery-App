import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import RestaurantCard from '../components/RestaurantCard'

export default function Restaurants() {
  const [searchParams] = useSearchParams()
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [cuisineFilter, setCuisineFilter] = useState(searchParams.get('cuisine') || '')
  const [ratingFilter, setRatingFilter] = useState('')
  const [sortBy, setSortBy] = useState('')

  const cuisines = ['All', 'Biryani', 'Pizza', 'Dosa', 'Chinese', 'Burger', 'Sushi', 'Tandoori', 'South Indian']

  useEffect(() => {
    let url = '/api/restaurants?'
    if (cuisineFilter && cuisineFilter !== 'All') url += `cuisine=${cuisineFilter}&`
    if (ratingFilter) url += `rating=${ratingFilter}&`
    if (sortBy) url += `sort=${sortBy}&`

    axios.get(url).then(res => {
      setRestaurants(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [cuisineFilter, ratingFilter, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Restaurants near you</h1>
        <p className="text-gray-500 text-sm">{restaurants.length} restaurants found</p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {cuisines.map(c => (
            <button
              key={c}
              onClick={() => setCuisineFilter(c === 'All' ? '' : c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                (c === 'All' && !cuisineFilter) || cuisineFilter === c
                  ? 'bg-primary text-white border-primary'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} className="px-4 py-2 rounded-xl border text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Rating</option>
            <option value="4.5">4.5+</option>
            <option value="4.0">4.0+</option>
            <option value="3.5">3.5+</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2 rounded-xl border text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Sort By</option>
            <option value="rating">Rating</option>
            <option value="deliveryTime">Delivery Time</option>
            <option value="costLow">Cost: Low to High</option>
            <option value="costHigh">Cost: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse"></div>
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No restaurants found matching your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(r => (
            <RestaurantCard key={r._id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  )
}
