import { Link } from 'react-router-dom'
import { 
  Store, 
  ShoppingCart, 
  Users, 
  History, 
  MessageSquare, 
  Layout, 
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react'

const UserPortal = () => {
  const features = [
    {
      id: '01',
      title: 'VENDOR DIRECTORY',
      description: 'Query available service providers and catalogs',
      link: '/user/vendors',
      icon: Store,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      id: '02',
      title: 'CART_BUFFER',
      description: 'Manage selected items and prepare final orders',
      link: '/user/cart',
      icon: ShoppingCart,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      id: '03',
      title: 'GUEST_REGISTRY',
      description: 'Maintain event attendee records and status',
      link: '/user/guest-list',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      id: '04',
      title: 'ORDER_LIFECYCLE',
      description: 'Track active transactions and fulfillment status',
      link: '/user/order-status',
      icon: History,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      id: '05',
      title: 'CUSTOM_INQUIRY',
      description: 'Initialize special request protocols for vendors',
      link: '/user/request-item',
      icon: MessageSquare,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
  ]

  return (
    <div className="page-container">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-100 pb-10">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-600/20">
            <Layout className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">User Portal</h1>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest mt-1">Event Resource Center</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link 
            key={feature.title} 
            to={feature.link} 
            className="card group hover:scale-[1.02] active:scale-95 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${feature.bg} ${feature.color} transition-colors group-hover:bg-slate-900 group-hover:text-white`}>
                  <feature.icon className="w-6 h-6" />
                </div>
              </div>
              <h2 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed uppercase tracking-tight">
                {feature.description}
              </p>
            </div>
            
            <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
              GO TO MODULE <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </div>
            
            <feature.icon className="absolute -right-4 -bottom-4 w-20 h-20 text-slate-100 opacity-0 group-hover:opacity-40 transition-opacity rotate-12" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default UserPortal
