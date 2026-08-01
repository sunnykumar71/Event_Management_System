import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'

// Auth Pages
import Index from './pages/Index.jsx'
import AdminLogin from './pages/auth/AdminLogin.jsx'
import AdminSignup from './pages/auth/AdminSignup.jsx'
import VendorLogin from './pages/auth/VendorLogin.jsx'
import VendorSignup from './pages/auth/VendorSignup.jsx'
import UserLogin from './pages/auth/UserLogin.jsx'
import UserSignup from './pages/auth/UserSignup.jsx'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import MaintainUser from './pages/admin/MaintainUser.jsx'
import MaintainVendor from './pages/admin/MaintainVendor.jsx'
import AddMembership from './pages/admin/AddMembership.jsx'
import UpdateMembership from './pages/admin/UpdateMembership.jsx'

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard.jsx'
import AddItem from './pages/vendor/AddItem.jsx'
import VendorProducts from './pages/vendor/VendorProducts.jsx'
import VendorTransactions from './pages/vendor/VendorTransactions.jsx'
import ProductRequests from './pages/vendor/ProductRequests.jsx'

// User Pages
import UserPortal from './pages/user/UserPortal.jsx'
import ViewVendors from './pages/user/ViewVendors.jsx'
import ViewProducts from './pages/user/ViewProducts.jsx'
import Cart from './pages/user/Cart.jsx'
import Checkout from './pages/user/Checkout.jsx'
import OrderSuccess from './pages/user/OrderSuccess.jsx'
import RequestItem from './pages/user/RequestItem.jsx'
import GuestList from './pages/user/GuestList.jsx'
import OrderStatus from './pages/user/OrderStatus.jsx'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor/signup" element={<VendorSignup />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignup />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/maintain-user"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MaintainUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/maintain-vendor"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MaintainVendor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-membership"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddMembership />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/update-membership"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UpdateMembership />
              </ProtectedRoute>
            }
          />

          {/* Vendor Routes */}
          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/add-item"
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <AddItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/products"
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <VendorProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/transactions"
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <VendorTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/product-requests"
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <ProductRequests />
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/portal"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/vendors"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <ViewVendors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/products"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <ViewProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/cart"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/checkout"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/order-success"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/request-item"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <RequestItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/guest-list"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <GuestList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/order-status"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <OrderStatus />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
