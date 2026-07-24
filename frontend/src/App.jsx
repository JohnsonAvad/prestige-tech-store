import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon'
import Home from './pages/shop/Home'
import CategoryPage from './pages/shop/CategoryPage'
import ProductPage from './pages/shop/ProductPage'
import SearchPage from './pages/shop/SearchPage'
import CheckoutPage from './pages/shop/CheckoutPage'
import OrderConfirmation from './pages/shop/OrderConfirmation'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AddProduct from './pages/admin/AddProduct'
import CSVImport from './pages/admin/CSVImport'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
<Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />


        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Home />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/admin/products/import" element={<CSVImport />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App