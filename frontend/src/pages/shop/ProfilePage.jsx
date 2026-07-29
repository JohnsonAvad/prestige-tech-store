import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'

export default function ProfilePage() {
  const { user, token, isAuthenticated, logout, updateUser } = useAuthStore()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })

  if (!isAuthenticated) {
    navigate('/login?redirect=/account/profile')
    return null
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://prestige-tech-store-api.vercel.app/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')
      updateUser(form)
      setSuccess(true)
      setEditing(false)
      setTimeout(() => setSuccess(false), 3000)
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

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}>My Profile</h1>
          <p style={{ fontSize: '14px', color: '#1d4ed8', fontWeight: 600 }}>Manage your account details</p>
        </div>

        {/* Profile card */}
        <div style={{ borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden', marginBottom: '16px' }}>

          {/* Green header with avatar */}
          <div style={{ background: '#16a34a', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '24px', fontWeight: 900, color: 'white' }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{ fontSize: '18px', fontWeight: 800, color: 'white', marginBottom: '2px' }}>{user?.name}</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>{user?.email}</p>
              <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px', marginTop: '6px' }}>
                {user?.role === 'ADMIN' ? 'Administrator' : 'Customer'}
              </span>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'white', padding: '24px' }}>

            {success && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                <p style={{ color: '#15803d', fontSize: '13px', fontWeight: 600 }}>Profile updated successfully.</p>
              </div>
            )}

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  disabled={!editing}
                  style={{ ...inputStyle, background: editing ? 'white' : '#f8fafc', color: editing ? '#0f172a' : '#64748b' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  value={user?.email}
                  disabled
                  style={{ ...inputStyle, background: '#f8fafc', color: '#64748b' }}
                />
                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Email cannot be changed</p>
              </div>

              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  disabled={!editing}
                  style={{ ...inputStyle, background: editing ? 'white' : '#f8fafc', color: editing ? '#0f172a' : '#64748b' }}
                />
              </div>

              {editing ? (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => { setEditing(false); setError('') }}
                    style={{ flex: 1, background: '#eff6ff', border: '2px solid #bfdbfe', color: '#1d4ed8', fontWeight: 700, padding: '12px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ flex: 2, background: '#16a34a', color: 'white', fontWeight: 800, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  style={{ width: '100%', background: '#16a34a', color: 'white', fontWeight: 800, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                >
                  Edit Profile
                </button>
              )}

            </form>
          </div>

          {/* Light blue footer */}
          <div style={{ background: '#eff6ff', borderTop: '2px solid #bfdbfe', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#1d4ed8', fontWeight: 600 }}>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-UG', { month: 'long', year: 'numeric' })}</span>
            <button
              onClick={logout}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>

        </div>

        {/* Quick links */}
        <div style={{ borderRadius: '20px', border: '2px solid #bfdbfe', overflow: 'hidden' }}>
          <div style={{ background: '#16a34a', padding: '14px 20px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Quick Links</p>
          </div>
          <div style={{ background: 'white' }}>
            {[
              { label: 'My Orders', desc: 'View and track your orders', to: '/account/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { label: 'My Wishlist', desc: 'Products you have saved', to: '/account/wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            ].map((link, i) => (
              <a key={i} href={link.to} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px', textDecoration: 'none', borderBottom: i === 0 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ width: '36px', height: '36px', background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{link.label}</p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{link.desc}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
          <div style={{ background: '#eff6ff', borderTop: '2px solid #bfdbfe', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600 }}>Your account information is secure</span>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}