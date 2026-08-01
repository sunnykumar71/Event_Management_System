import { Link } from 'react-router-dom'
import { ShieldCheck, Store, User, ArrowRight } from 'lucide-react'

const Index = () => {
  const roles = [
    {
      id: '01',
      title: 'ADMINISTRATOR',
      description: 'System Maintenance, User Records, Vendor Approvals, Membership Logic.',
      link: '/admin/login',
      icon: ShieldCheck,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      id: '02',
      title: 'VENDOR',
      description: 'Product Catalog, Item Management, Transaction Tracking, User Requests.',
      link: '/vendor/login',
      icon: Store,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      id: '03',
      title: 'REGULAR USER',
      description: 'Vendor Directory, Cart Management, Guest List, Order Status.',
      link: '/user/login',
      icon: User,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    }
  ]

  return (
    <div className="page-container flex flex-col justify-center min-h-[75vh]">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3 uppercase">
          Management System
        </h1>
        <p className="text-slate-500 font-medium max-w-lg mx-auto uppercase tracking-widest text-[11px]">
          Secure Entry Protocol // Select Authorized Role
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Link 
            key={role.id} 
            to={role.link} 
            className="card group hover:scale-[1.02] active:scale-95 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${role.bg} ${role.color} transition-colors group-hover:bg-slate-900 group-hover:text-white`}>
                  <role.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-tighter">
                  Role_{role.id}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-slate-900">
                {role.title}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-tight">
                {role.description}
              </p>
            </div>
            
            <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
              Initialize Access <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
      
    </div>
  )
}

export default Index
