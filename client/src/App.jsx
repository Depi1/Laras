import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { AuthProvider } from './components/AuthContext'
import { RequireAuth } from './components/RouteGuard'
import { AdminDashboard, AdminOrders, AdminProducts, ProductForm } from './pages/AdminPages'
import { AuthPage } from './pages/AccountPages'
import { CartPage, HomePage, ProductDetailPage, ProductsPage, ProfilePage } from './pages/StorePages'

export default function App() {
  return <AuthProvider><BrowserRouter><Routes><Route element={<Layout />}><Route index element={<HomePage />} /><Route path="products" element={<ProductsPage />} /><Route path="products/:id" element={<ProductDetailPage />} /><Route path="login" element={<AuthPage />} /><Route path="register" element={<AuthPage mode="register" />} /><Route element={<RequireAuth />}><Route path="cart" element={<CartPage />} /><Route path="profile" element={<ProfilePage />} /></Route><Route element={<RequireAuth role="admin" />}><Route path="admin" element={<AdminDashboard />} /><Route path="admin/orders" element={<AdminOrders />} /><Route path="admin/products" element={<AdminProducts />} /><Route path="admin/products/new" element={<ProductForm />} /><Route path="admin/products/:id/edit" element={<ProductForm edit />} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes></BrowserRouter></AuthProvider>
}
