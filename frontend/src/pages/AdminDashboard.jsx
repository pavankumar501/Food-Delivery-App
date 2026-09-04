import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ restaurants: 0, orders: 0, users: 0 })
  const [orders, setOrders] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const authHeaders = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return }
    Promise.all([
      axios.get('/api/restaurants', { headers: authHeaders }),
      axios.get('/api/orders', { headers: authHeaders })
    ]).then(([restRes, ordersRes]) => {
      setRestaurants(restRes.data)
      setOrders(ordersRes.data)
      setStats({ restaurants: restRes.data.length, orders: ordersRes.data.length, users: new Set(ordersRes.data.map(o => o.user?._id)).size })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user, token, navigate])

  const updateOrderStatus = async (orderId, status) => {
    await axios.put(`/api/orders/${orderId}/status`, { status }, { headers: authHeaders })
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o))
  }

  const toggleRestaurant = async (rest) => {
    await axios.put(`/api/restaurants/${rest._id}`, { isOpen: !rest.isOpen }, { headers: authHeaders })
    setRestaurants(prev => prev.map(r => r._id === rest._id ? { ...r, isOpen: !r.isOpen } : r))
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><div className="bg-gray-200 rounded-2xl h-64 animate-pulse"></div></div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Restaurants', value: stats.restaurants, icon: '🏪', color: 'bg-blue-500' },
          { label: 'Total Orders', value: stats.orders, icon: '📦', color: 'bg-primary' },
          { label: 'Total Users', value: stats.users, icon: '👥', color: 'bg-green-500' }
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className={`${s.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl`}>{s.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['overview', 'orders', 'restaurants'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-xl text-sm font-medium transition capitalize ${activeTab === tab ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {orders.slice(0, 5).map(o => (
                <div key={o._id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{o.user?.name || 'Customer'}</p>
                    <p className="text-xs text-gray-400">₹{o.finalAmount}</p>
                  </div>
                  <span className={`text-xs font-bold text-white px-3 py-1 rounded-full ${
                    o.orderStatus === 'delivered' ? 'bg-green-500' :
                    o.orderStatus === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}>{o.orderStatus}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Top Restaurants</h3>
            <div className="space-y-3">
              {restaurants.sort((a, b) => b.rating - a.rating).slice(0, 5).map(r => (
                <div key={r._id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.cuisine?.join(', ')}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600">★ {r.rating}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-500">Order ID</th>
                  <th className="text-left p-4 font-medium text-gray-500">Customer</th>
                  <th className="text-left p-4 font-medium text-gray-500">Restaurant</th>
                  <th className="text-left p-4 font-medium text-gray-500">Amount</th>
                  <th className="text-left p-4 font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} className="border-t hover:bg-gray-50">
                    <td className="p-4 text-xs font-mono">{o._id.slice(-8)}</td>
                    <td className="p-4">{o.user?.name}</td>
                    <td className="p-4">{o.restaurant?.name}</td>
                    <td className="p-4 font-medium">₹{o.finalAmount}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold text-white px-3 py-1 rounded-full ${
                        o.orderStatus === 'delivered' ? 'bg-green-500' :
                        o.orderStatus === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}>{o.orderStatus}</span>
                    </td>
                    <td className="p-4">
                      <select value={o.orderStatus} onChange={e => updateOrderStatus(o._id, e.target.value)} className="text-xs border rounded-lg px-2 py-1 focus:outline-none">
                        {['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'restaurants' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-500">Name</th>
                  <th className="text-left p-4 font-medium text-gray-500">Cuisine</th>
                  <th className="text-left p-4 font-medium text-gray-500">Rating</th>
                  <th className="text-left p-4 font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map(r => (
                  <tr key={r._id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium">{r.name}</td>
                    <td className="p-4 text-gray-500">{r.cuisine?.join(', ')}</td>
                    <td className="p-4">★ {r.rating}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${r.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => toggleRestaurant(r)} className={`text-xs font-bold px-4 py-1.5 rounded-lg transition ${r.isOpen ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                        {r.isOpen ? 'Close' : 'Open'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
