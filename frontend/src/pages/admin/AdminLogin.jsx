 
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password }
      )
      const { token, user } = response.data
      if (user.role !== 'ADMIN' && user.role !== 'SUPPORT') {
        setError('Access denied. Admin privileges required.')
        setLoading(false)
        return
      }
      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_user', JSON.stringify(user))
      navigate('/admin/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.error || 'Login failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-600/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <span className="font-bold text-white text-xl">P</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-xl leading-none">PRESTIGE</div>
              <div className="text-xs text-white/40 tracking-widest uppercase">TechStore</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-white/40 text-sm mt-2">
            Sign in to access the store management dashboard
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@techstore.ug"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/30 text-xs text-center mb-3">Test credentials</p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
              <p className="text-white/50 text-xs">
                Email: <span className="text-white/80 font-mono">admin@techstore.ug</span>
              </p>
              <p className="text-white/50 text-xs">
                Password: <span className="text-white/80 font-mono">ChangeMe@2024!</span>
              </p>
            </div>
          </div>
        </div>
        <p className="text-center mt-6">
          <a href="/" className="text-white/30 hover:text-white/60 text-sm transition-colors duration-200">
            Back to website
          </a>
        </p>
      </div>
    </div>
  )
}