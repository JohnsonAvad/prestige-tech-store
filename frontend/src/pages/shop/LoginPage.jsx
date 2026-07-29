import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Navbar from '../../components/shared/Navbar'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://prestige-tech-store-api.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      setAuth(data.user, data.token)
      navigate(redirect)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', border: '2px solid #bfdbfe',
    borderRadius: '10px', padding: '12px 14px',
    fontSize: '14px', outline: 'none',
    color: '#0f172a', background: 'white',
    fontFamily: 'inherit'
  }

  const labelStyle = {
    display: 'block', fontSize: '12px',
    fontWeight: 700, color: '#1d4ed8', marginBottom: '6px'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      <Navbar />

      <div style={{ maxWidth: '440px', margin: '48px auto', padding: '24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', background: '#16a34a', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}>Welcome back</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Sign in to your Prestige TechStore account</p>
        </div>

        {/* Card */}
        <div style={{ borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden' }}>

          {/* Green header */}
          <div style={{ background: '#16a34a', padding: '16px 24px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>Sign In to Your Account</p>
          </div>

          {/* Form */}
          <div style={{ background: 'white', padding: '24px' }}>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={{ ...inputStyle, paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', background: '#16a34a', color: 'white', fontWeight: 800, padding: '14px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

            </form>
          </div>

          {/* Light blue footer */}
          <div style={{ background: '#eff6ff', borderTop: '2px solid #bfdbfe', padding: '16px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#1d4ed8' }}>
              Do not have an account?{' '}
              <Link to="/register" style={{ fontWeight: 700, color: '#16a34a', textDecoration: 'none' }}>
                Create one free
              </Link>
            </p>
          </div>

        </div>

        {/* Security badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', background: '#eff6ff', borderRadius: '10px', padding: '10px 14px', border: '1px solid #bfdbfe', marginTop: '16px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600 }}>Your account is secured and protected</span>
        </div>

      </div>
    </div>
  )
}