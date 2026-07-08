import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import AdminLayout from './layouts/AdminLayout'
import HomeLayout from './layouts/HomeLayout'
import VendorLayout from './layouts/VendorLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import AdminDisputesPage from './pages/dashboard/AdminDisputesPage'
import AdminTransactionsPage from './pages/dashboard/AdminTransactionsPage'
import AdminUsersPage from './pages/dashboard/AdminUsersPage'
import VendorDashboard from './pages/dashboard/VendorDashboard'
import VendorOrdersPage from './pages/dashboard/VendorOrdersPage'
import VendorProductsPage from './pages/dashboard/VendorProductsPage'
import VendorStorePage from './pages/dashboard/VendorStorePage'
import CartPage from './pages/customer/CartPage'
import CheckoutPage from './pages/customer/CheckoutPage'
import HomePage from './pages/customer/HomePage'
import OrdersPage from './pages/customer/OrdersPage'
import ProductDetailPage from './pages/customer/ProductDetailPage'
import StoreProductsPage from './pages/customer/StoreProductsPage'
import StoresPage from './pages/customer/StoresPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<HomePage />} />
          <Route path="stores" element={<StoresPage />} />
          <Route path="stores/:storeSlug" element={<StoreProductsPage />} />
          <Route path="stores/:storeSlug/products/:productSlug" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/vendor" element={<VendorLayout />}>
          <Route index element={<VendorDashboard />} />
          <Route path="products" element={<VendorProductsPage />} />
          <Route path="orders" element={<VendorOrdersPage />} />
          <Route path="store" element={<VendorStorePage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="disputes" element={<AdminDisputesPage />} />
          <Route path="transactions" element={<AdminTransactionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
