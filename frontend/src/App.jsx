import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ComingSoon from "./pages/ComingSoon";
import Home from "./pages/shop/Home";
import CategoryPage from "./pages/shop/CategoryPage";
import ProductPage from "./pages/shop/ProductPage";
import SearchPage from "./pages/shop/SearchPage";
import CheckoutPage from "./pages/shop/CheckoutPage";
import OrderConfirmation from "./pages/shop/OrderConfirmation";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import CSVImport from "./pages/admin/CSVImport";
import AdminOrders from "./pages/admin/AdminOrders";
import LoginPage from "./pages/shop/LoginPage";
import RegisterPage from "./pages/shop/RegisterPage";
import MyOrdersPage from "./pages/shop/MyOrdersPage";
import WishlistPage from "./pages/shop/WishlistPage";
import ProfilePage from "./pages/shop/ProfilePage";

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
        <Route
          path="/order-confirmation/:orderNumber"
          element={<OrderConfirmation />}
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/admin/products/edit/:id" element={<AdminProducts />} />
        <Route path="/admin/products/import" element={<CSVImport />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account/wishlist" element={<WishlistPage />} />
        <Route path="/account/profile" element={<ProfilePage />} />
        <Route path="/account/orders" element={<MyOrdersPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
