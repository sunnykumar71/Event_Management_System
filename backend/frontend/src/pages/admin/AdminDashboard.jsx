import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import { 
  Shield, 
  Users, 
  Store, 
  Settings, 
  PlusCircle, 
  RotateCw, 
  PieChart, 
  ChevronRight,
  Database
} from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    vendors: 0,
    memberships: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const [usersRes, vendorsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getVendors(),
      ])

      const vendors = vendorsRes.data.vendors || []
      setStats({
        users: usersRes.data.count || 0,
        vendors: vendorsRes.data.count || 0,
        memberships: vendors.filter(v => v.membership?.length > 0).length,
      })
    } catch (error) {
      toast.error('Data sync failed')
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { label: 'MAINTAIN USERS', link: '/admin/maintain-user', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'MAINTAIN VENDORS', link: '/admin/maintain-vendor', icon: Store, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'ADD MEMBERSHIP', link: '/admin/add-membership', icon: PlusCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'UPDATE MEMBERSHIP', link: '/admin/update-membership', icon: RotateCw, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="page-container">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-900/20">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest mt-1">System Control & Management</p>
          </div>
        </div>
        <button 
          onClick={fetchStats}
          className="btn-secondary flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
        >
          <RotateCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="card shadow-xl border-slate-100">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Settings className="w-3 h-3" /> Quick Operations
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action) => (
                <Link 
                  key={action.label} 
                  to={action.link} 
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${action.bg} ${action.color}`}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-slate-700 tracking-wider font-mono uppercase">{action.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-900/30 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <PieChart className="w-3 h-3" /> Key Metrics
                </h2>
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-800 border border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[9px] font-bold text-slate-300">SYSTEM_ACTIVE</span>
                </div>
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
                    <span className="text-[10px] text-slate-400 font-black tracking-[0.15em] uppercase">Total Users</span>
                    <span className="text-5xl font-black font-mono tracking-tighter text-white">
                      {stats.users.toString().padStart(3, '0')}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-slate-400 font-black tracking-[0.15em] uppercase">Total Vendors</span>
                    <span className="text-5xl font-black font-mono tracking-tighter text-white">
                      {stats.vendors.toString().padStart(3, '0')}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-slate-400 font-black tracking-[0.15em] uppercase">Premium Tier</span>
                    <span className="text-5xl font-black font-mono tracking-tighter text-white">
                      {stats.memberships.toString().padStart(3, '0')}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <Database className="absolute -left-10 -bottom-10 w-48 h-48 text-white/[0.03] -rotate-12" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
