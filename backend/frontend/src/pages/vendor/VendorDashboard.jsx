import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { vendorAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import { 
  Store, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  PlusCircle, 
  TrendingUp, 
  ArrowRight,
  Activity,
  Box,
  ClipboardList
} from 'lucide-react'

const VendorDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    transactions: 0,
    requests: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const [productsRes, transactionsRes, requestsRes] = await Promise.all([
        vendorAPI.getProducts(),
        vendorAPI.getTransactions(),
        vendorAPI.getProductRequests(),
      ])

      setStats({
        products: productsRes.data.count || 0,
        transactions: transactionsRes.data.count || 0,
        requests: requestsRes.data.count || 0,
      })
    } catch (error) {
      toast.error('Data sync failed')
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { label: 'ADD NEW ITEM', link: '/vendor/add-item', icon: PlusCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'CATALOG_VIEW', link: '/vendor/products', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'ORDER_HISTORY', link: '/vendor/transactions', icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'USER_MESSAGES', link: '/vendor/product-requests', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="page-container">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Vendor Portal</h1>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest mt-1">Business operations & Inventory Control</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
           <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
           <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Store_Live</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="card shadow-xl border-slate-100">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <ClipboardList className="w-3 h-3" /> Management Unit
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action) => (
                <Link 
                  key={action.label} 
                  to={action.link} 
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${action.bg} ${action.color}`}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-slate-700 tracking-wider font-mono uppercase">{action.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-all group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
          
          <div className="card bg-emerald-600 text-white border-emerald-600 relative overflow-hidden group hover:bg-emerald-700 transition-colors">
             <div className="relative z-10">
               <h3 className="text-sm font-bold uppercase tracking-tight mb-1">Premium Visibility</h3>
               <p className="text-[10px] opacity-80 uppercase font-medium">Your products are currently prioritized in the global catalog.</p>
             </div>
             <TrendingUp className="absolute -right-4 -bottom-4 w-20 h-20 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-900/30 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> Key Insights
                </h2>
              </div>

              {loading ? (
                <div className="space-y-8 py-10">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse space-y-2">
                      <div className="h-2 w-32 bg-slate-800 rounded"></div>
                      <div className="h-8 w-16 bg-slate-800 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-slate-400 font-black tracking-[0.15em] uppercase">Total Products</span>
                    <span className="text-5xl font-black font-mono tracking-tighter text-white">
                      {stats.products.toString().padStart(3, '0')}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-slate-400 font-black tracking-[0.15em] uppercase">Orders Fulfilled</span>
                    <span className="text-5xl font-black font-mono tracking-tighter text-white">
                      {stats.transactions.toString().padStart(3, '0')}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-slate-400 font-black tracking-[0.15em] uppercase">Pending Requests</span>
                    <span className="text-5xl font-black font-mono tracking-tighter text-white">
                      {stats.requests.toString().padStart(3, '0')}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <Box className="absolute -right-10 -bottom-10 w-48 h-48 text-white/[0.03] -rotate-12" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorDashboard
