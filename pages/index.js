export default function Home() {
  const [action, setAction] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await res.json()

if (!res.ok) {
  setMessage(data.error)
  return
}

localStorage.setItem('token', data.token)
localStorage.setItem('role', data.role)
localStorage.setItem('userId', data.userId)

if (data.role === 'admin') {
  window.location.href = '/admin'
} else {
  window.location.href = '/dashboard'
}
    } catch (error) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            SartRends AI
          </h1>
          <p className="text-gray-400">AI-Powered SaaS Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setAction('login')}
              className={`flex-1 p-4 rounded-xl font-semibold transition-all ${
                action === 'login' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setAction('register')}
              className={`flex-1 p-4 rounded-xl font-semibold transition-all ${
                action === 'register' 
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Register
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : action === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {message && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react';
