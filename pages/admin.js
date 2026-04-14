import { useEffect, useState } from 'react'

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

  const loadData = async (token) => {
    setLoading(true)
    try {
      const headers = { Authorization: `Bearer ${token}` }

      const revRes = await fetch('/api/admin/revenue', { headers })
      setRevenue((await revRes.json()).total || 0)

      const userRes = await fetch('/api/admin/users', { headers })
      setUsers(await userRes.json())

      const payRes = await fetch('/api/admin/payments', { headers })
      setPayments(await payRes.json())

      const subRes = await fetch('/api/admin/subscriptions', { headers })
      setSubscriptions(await subRes.json())
    } catch (e) {
      console.error(e)
    }
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
            <div className="text-4xl font-bold">{subscriptions.filter(s => s.active).length}</div>
            <div className="opacity-75">Active Subs</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 rounded-3xl text-center">
            <div className="text-4xl font-bold">{payments.filter(p => p.status === 'pending').length}</div>
            <div className="opacity-75">Pending Payments</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-8 rounded-3xl text-center">
            <div className="text-4xl font-bold">{payments.length}</div>
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

          {tab === 'dashboard' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">📊 Dashboard</h2>
              <p className="text-xl opacity-75 mb-8">Full control. All features live.</p>
              <div className="grid md:grid-cols-2 gap-6">
                <a href="/dashboard" className="bg-blue-600 hover:bg-blue-500 p-6 rounded-2xl text-center">👤 Preview Dashboard</a>
                <a href="/billing" className="bg-green-600 hover:bg-green-500 p-6 rounded-2xl text-center">💳 Test Billing</a>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">👥 Users ({users.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-gray-800 rounded-2xl">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Role</th>
                      <th className="p-4 text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="p-4">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            u.role === 'admin' ? 'bg-purple-600' : 'bg-gray-600'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 opacity-75">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'payments' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">💳 Payments ({payments.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-gray-800 rounded-2xl">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="p-4 text-left">User</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Created</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="p-4">{p.user?.email || 'N/A'}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            p.status === 'approved' ? 'bg-green-600' : 'bg-yellow-600'
                          }`}>
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 opacity-75">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          {p.status === 'pending' && (
                            <button
                              onClick={() => approvePayment(p.id)}
                              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl font-bold"
                            >
                              ✅ Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'subscriptions' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">📋 Subscriptions ({subscriptions.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-gray-800 rounded-2xl">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="p-4 text-left">User</th>
                      <th className="p-4 text-left">Plan</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Start</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map(s => (
                      <tr key={s.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="p-4">{s.user?.email || 'N/A'}</td>
                        <td className="p-4 font-bold">{s.plan}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            s.active ? 'bg-green-600' : 'bg-gray-600'
                          }`}>
                            {s.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4 opacity-75">{new Date(s.startDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center opacity-75 text-sm">
          <a href="https://wa.me/923454837460" className="text-green-400 hover:underline">📱 Support</a>
        </div>
      </div>
    </div>
  )
}

