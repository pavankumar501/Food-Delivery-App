import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const statusSteps = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']
const statusLabels = { placed: 'Order Placed', confirmed: 'Confirmed', preparing: 'Preparing', out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled' }
const statusColors = { placed: 'bg-blue-500', confirmed: 'bg-yellow-500', preparing: 'bg-orange-500', out_for_delivery: 'bg-purple-500', delivered: 'bg-green-500', cancelled: 'bg-red-500' }

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    axios.get('/api/orders/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setOrders(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user, token, navigate])

  const getOrderStep = (status) => statusSteps.indexOf(status)

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="bg-gray-200 rounded-2xl h-40 animate-pulse"></div>)}</div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">When you order, it will appear here</p>
          <Link to="/restaurants" className="bg-primary hover:bg-primaryDark text-white font-bold px-8 py-3 rounded-xl transition inline-block">Order Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-800">{order.restaurant?.name || 'Restaurant'}</h3>
                  <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold text-white px-3 py-1 rounded-full ${statusColors[order.orderStatus]}`}>
                    {statusLabels[order.orderStatus]}
                  </span>
                  <p className="text-sm font-bold mt-1">₹{order.finalAmount}</p>
                </div>
              </div>

              {order.orderStatus !== 'cancelled' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    {statusSteps.map((step, i) => {
                      const currentStep = getOrderStep(order.orderStatus)
                      const isCompleted = i <= currentStep
                      return (
                        <div key={step} className="flex flex-col items-center flex-1">
                          <div className={`w-4 h-4 rounded-full ${isCompleted ? 'bg-primary' : 'bg-gray-300'} ${i < statusSteps.length - 1 ? 'relative' : ''}`}>
                            {i < statusSteps.length - 1 && (
                              <div className={`absolute top-1/2 left-full w-full h-0.5 -translate-y-1/2 ${i < currentStep ? 'bg-primary' : 'bg-gray-300'}`} style={{ width: 'calc(100%)' }}></div>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 mt-1 hidden sm:block">{statusLabels[step]}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="border-t pt-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span className="text-gray-600">{item.name} × {item.quantity}</span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {order.rating && (
                <div className="mt-3 bg-yellow-50 rounded-xl p-3">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="font-medium">Your Rating:</span>
                    {'⭐'.repeat(order.rating)}
                  </div>
                  {order.review && <p className="text-gray-500 text-xs mt-1">{order.review}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
