import { Link } from 'react-router-dom'

export default function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurant/${restaurant.slug}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.image || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop`}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {restaurant.offers && restaurant.offers[0] && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                {restaurant.offers[0]}
              </span>
            </div>
          )}
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Currently Closed</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary transition">{restaurant.name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {restaurant.cuisine?.slice(0, 3).map((c, i) => (
              <span key={i} className="text-gray-500 text-xs">{c}{i < Math.min(restaurant.cuisine.length, 3) - 1 ? ',' : ''}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {restaurant.rating}
            </div>
            <span className="text-gray-400 text-xs">({restaurant.reviewCount}+)</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600 text-xs">{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-400 text-xs">₹{restaurant.minOrder} for two</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400 text-xs">{restaurant.address?.split(',').pop()?.trim()}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
