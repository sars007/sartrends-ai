import { useEffect, useState } from 'react'
import { callAPI } from '../lib/api'

export default function Admin() {
  const [token, setToken] = useState('')
  const [tab, setTab] = useState('dashboard')
  const [revenue, setRevenue] = useState(0)
  const [users, setUsers] = useState([])
  const [payments, setPayments] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (!savedToken) {
      window.location.href = '/'
      return
    }
    setToken(savedToken)
    loadData(savedToken)
  }, [])

  const safeArray = (data) => Array.isArray(data) ? data : []

  const loadData = async (token) => {
    setLoading(true)
    const [revResult, userResult, payResult, subResult] = await Promise.all([
      callAPI('/api/admin/revenue'),
      callAPI('/api/admin/users'),
      callAPI('/api/admin/payments'),
      callAPI('/api/admin/subscriptions')
    ])
    
    setRevenue(revResult?.total || 0)
    setUsers(Array.isArray(userResult) ? userResult : [])
    setPayments(Array.isArray(payResult) ? payResult : [])
    setSubscriptions(Array.isArray(subResult) ? subResult : [])
    setLoading(false)
  }

  const approvePayment = async (paymentId) => {
    try {
      await fetch(`/api/admin/payments/${paymentId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      loadData(token)
    } catch (e) {
      alert('Approve failed')
    }
  }

  if (!token) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold">🛡️ Admin God Mode</h1>
          <div className="text-3xl font-bold text-green-400">
            Revenue: ${revenue.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-3xl text-center">
            <div className="text-4xl font-bold">{users.length}</div>
            <div className="opacity-75">Users</div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-3xl text-center">
            <div className="text-4xl font-bold">
              {safeArray(subscriptions).filter(s => s.active).length}
            </div>
            <div className="opacity-75">Active Subs</div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 rounded-3xl text-center">
            <div className="text-4xl font-bold">
              {safeArray(payments).filter(p => p?.status === 'pending').length}
            </div>
            <div className="opacity-75">Pending Payments</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-8 rounded-3xl text-center">
            <div className="text-4xl font-bold">{safeArray(payments).length}</div>
            <div className="opacity-75">Total Payments</div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700">
          <div className="flex bg-gray-800 rounded-2xl p-1 mb-8">
            {['dashboard', 'users', 'payments', 'subscriptions'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all ${
                  tab === t
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl'
                    : 'hover:bg-gray-700'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {loading && <div className="text-center py-12">Loading...</div>}

          {tab === 'payments' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">💳 Payments ({safeArray(payments).length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-gray-800 rounded-2xl">
                  <tbody>
                    {safeArray(payments).map(p => (
                      <tr key={p.id}>
                        <td className="p-4">{p.user?.email || 'N/A'}</td>
                        <td className="p-4">{p.status}</td>
                        <td className="p-4">
                          {p.status === 'pending' && (
                            <button onClick={() => approvePayment(p.id)}>Approve</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

