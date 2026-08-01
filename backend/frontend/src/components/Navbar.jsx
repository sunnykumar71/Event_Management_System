import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { 
  Package2, 
  User, 
  Store, 
  ShoppingCart, 
  History, 
  PlusCircle, 
  LayoutDashboard, 
  LogOut,
  Users,
  CreditCard,
  Settings
} from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    if (user.role === 'admin') return '/admin/dashboard'
    if (user.role === 'vendor') return '/vendor/dashboard'
    return '/user/portal'
  }

  const getNavLinks = () => {
    if (!user) return []

    if (user.role === 'admin') {
      return [
        { to: '/admin/dashboard', label: 'Home', icon: LayoutDashboard },
        { to: '/admin/maintain-user', label: 'Users', icon: Users },
        { to: '/admin/maintain-vendor', label: 'Vendors', icon: Store },
        { to: '/admin/add-membership', label: 'Membership', icon: PlusCircle },
      ]
    }

    if (user.role === 'vendor') {
      return [
        { to: '/vendor/dashboard', label: 'Home', icon: LayoutDashboard },
        { to: '/vendor/add-item', label: 'Add Item', icon: PlusCircle },
        { to: '/vendor/products', label: 'Products', icon: Package2 },
        { to: '/vendor/product-requests', label: 'Requests', icon: History },
      ]
    }

    return [
      { to: '/user/portal', label: 'Home', icon: LayoutDashboard },
      { to: '/user/vendors', label: 'Vendors', icon: Store },
      { to: '/user/cart', label: 'Cart', icon: ShoppingCart },
      { to: '/user/guest-list', label: 'Guests', icon: Users },
      { to: '/user/order-status', label: 'Orders', icon: History },
    ]
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to={getDashboardLink()} className="flex items-center gap-2 group">
            <div className="p-1.5 bg-slate-900 rounded-lg group-hover:bg-slate-800 transition-colors">
              <Package2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight uppercase text-sm">
              Event Management
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {getNavLinks().map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    {user.role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Logout Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/" className="btn-primary py-1.5 px-4 text-xs font-bold uppercase tracking-widest">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
