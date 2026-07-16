import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'


export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const userData = localStorage.getItem('admin_user')
    if (!token || !userData) {
      navigate('/admin/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/admin/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-600/10 rounded-full blur-3xl" />
      </div>
      <nav className="relative z-10 bg-white/5 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <span className="font-bold text-white">P</span>
            </div>
            <div>
              <div className="font-bold text-white text-sm leading-none">PRESTIGE TECHSTORE</div>
              <div className="text-xs text-white/40">Admin Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-white text-sm font-medium">{user.name}</div>
              <div className="text-white/40 text-xs">{user.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Here is what is happening with your store
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Authentication', value: 'Active', sub: 'JWT system running', color: 'green', icon: '🔐' },
            { label: 'Database', value: '14 Tables', sub: 'All tables synced', color: 'blue', icon: '🗄️' },
            { label: 'API Status', value: 'Online', sub: 'All endpoints ready', color: 'green', icon: '⚡' },
            { label: 'Store Status', value: 'Coming Soon', sub: 'Launching in 35 days', color: 'yellow', icon: '🚀' },
          ].map((card) => (
            <div key={card.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  card.color === 'green' ? 'bg-green-500/10 text-green-400' :
                  card.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {card.value}
                </span>
              </div>
              <div className="text-white font-semibold text-sm">{card.label}</div>
              <div className="text-white/40 text-xs mt-1">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  {[
    { label: 'Add Product', icon: '➕', to: '/admin/products/add', color: 'blue' },
    { label: 'All Products', icon: '📦', to: '/admin/products', color: 'green' },
    { label: 'Import CSV', icon: '📥', to: '/admin/products/import', color: 'purple' },
    { label: 'View Store', icon: '🏪', to: '/', color: 'teal' },
  ].map((action) => (
    <Link
      key={action.label}
      to={action.to}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-200"
    >
      <span className="text-3xl">{action.icon}</span>
      <span className="text-white/60 text-xs font-semibold text-center">{action.label}</span>
    </Link>
  ))}
</div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold text-lg mb-4">Features Being Built</h2>
          <div className="space-y-3">
            {[
              { feature: 'Product Management — Add, edit, delete 1000+ products', week: 'Week 2' },
              { feature: 'Order Management — View and process customer orders', week: 'Week 2' },
              { feature: 'MTN Mobile Money Integration', week: 'Week 3' },
              { feature: 'Airtel Money Integration', week: 'Week 3' },
              { feature: 'Loyalty Points and Rewards System', week: 'Week 4' },
              { feature: 'Customer Support Dashboard', week: 'Week 4' },
              { feature: 'Sales Analytics and Reports', week: 'Week 4' },
              { feature: 'Full Store Launch', week: 'Week 5' },
            ].map((item) => (
              <div key={item.feature} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-white/20">○</span>
                  <span className="text-white/60 text-sm">{item.feature}</span>
                </div>
                <span className="text-white/30 text-xs bg-white/5 px-2 py-1 rounded-full whitespace-nowrap ml-4">
                  {item.week}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Admin Email', value: user.email },
              { label: 'Role', value: user.role },
              { label: 'Database', value: 'PostgreSQL on Supabase' },
              { label: 'Backend', value: 'Node.js + Express on Vercel' },
              { label: 'Frontend', value: 'React + Vite on Vercel' },
              { label: 'Domain', value: 'prestigetechstore.com' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-white/30 text-sm w-32 shrink-0">{item.label}</span>
                <span className="text-white/70 text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}