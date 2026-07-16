import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon'
import Home from './pages/shop/Home'
import CategoryPage from './pages/shop/CategoryPage'
import ProductPage from './pages/shop/ProductPage'
import SearchPage from './pages/shop/SearchPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App