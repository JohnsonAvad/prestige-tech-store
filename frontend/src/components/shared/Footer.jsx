import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 mt-16">

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <span className="font-black text-white">P</span>
              </div>
              <div>
                <div className="font-black text-white text-sm leading-none">PRESTIGE</div>
                <div className="text-white/40 text-xs tracking-widest">TECHSTORE</div>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              Uganda's most premium destination for genuine tech products.
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5">
                <span className="text-yellow-400 text-xs font-bold">MTN MoMo</span>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5">
                <span className="text-red-400 text-xs font-bold">Airtel Money</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'All Products', to: '/products' },
                { label: 'New Arrivals', to: '/new-arrivals' },
                { label: 'Deals', to: '/deals' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-white/40 hover:text-white text-sm transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {[
                { label: 'Track My Order', to: '/account/orders' },
                { label: 'Returns Policy', to: '/returns' },
                { label: 'Support Center', to: '/support' },
                { label: 'FAQ', to: '/faq' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-white/40 hover:text-white text-sm transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white/40 text-sm">Kampala, Uganda</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-white/40 text-sm">+256 704 068 865</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-white/40 text-sm">info@prestigetechstore.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-white/5 py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-xs">© 2025 Prestige TechStore · Kampala, Uganda · All rights reserved</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-white/20 hover:text-white/40 text-xs transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-white/20 hover:text-white/40 text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

    </footer>
  )
}