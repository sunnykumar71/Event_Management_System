import { useEffect, useState } from 'react'
import { vendorAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import BackButton from '../../components/BackButton.jsx'
import { 
  Package, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Search, 
  Database,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react'

const VendorProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await vendorAPI.getProducts()
      setProducts(response.data.products || [])
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Permanently remove item from catalog?')) return
    try {
      await vendorAPI.deleteProduct(id)
      toast.success('Item Purged')
      fetchProducts()
    } catch (error) {
      toast.error('Deletion failed')
    }
  }

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <BackButton />
        <Link 
          to="/vendor/add-item" 
          className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-[0.15em] shadow-lg shadow-emerald-600/20 bg-emerald-600 border-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Register New Item
        </Link>
      </div>

      <header className="page-header flex items-center gap-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
           <Package className="w-6 h-6" />
        </div>
        <div>
          <h1 className="page-title">Product Catalog</h1>
          <p className="page-subtitle uppercase tracking-widest text-[10px] font-bold text-slate-400">Inventory and Product Management</p>
        </div>
      </header>

      {loading ? (
        <div className="p-20 text-center flex flex-col items-center gap-4">
          <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Loading Inventory...</div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="table-container shadow-xl shadow-slate-200/50">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="group">
                    <td>
                       <div className="flex flex-col gap-0.5">
                         <span className="font-black text-slate-900 uppercase text-sm tracking-tight group-hover:text-emerald-600 transition-colors">
                           {product.name}
                         </span>
                       </div>
                    </td>
                    <td>
                       <span className="px-2 py-1 rounded bg-slate-100 text-slate-900 font-mono text-xs font-black border border-slate-200">
                         ${product.price.toFixed(2)}
                       </span>
                    </td>
                    <td className="max-w-[200px]">
                      <p className="text-[10px] text-slate-500 font-medium uppercase leading-tight line-clamp-1 h-3.5">
                        {product.description}
                      </p>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2 opactiy-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDelete(product._id)} 
                          className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Purge Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <Search className="w-12 h-12 text-slate-200" />
                <div className="text-sm font-black text-slate-300 uppercase tracking-widest">
                  Your Catalog is Empty
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
             <div className="card border-slate-100 bg-slate-50 shadow-none">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                   <Database className="w-3 h-3" /> Catalog Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Total Items</span>
                      <span className="text-xl font-black text-slate-900 font-mono">{products.length.toString().padStart(3, '0')}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Authorization</span>
                      <div className="flex items-center gap-1.5 text-emerald-600">
                         <ShieldCheck className="w-3.5 h-3.5" />
                         <span className="text-[9px] font-black uppercase">VERIFIED</span>
                      </div>
                   </div>
                </div>
             </div>
             
             <Link to="/vendor/dashboard" className="card border-slate-900 bg-slate-900 text-white flex items-center justify-between group">
                <div>
                   <h3 className="text-sm font-black uppercase tracking-tight mb-0.5">Access Dashboard</h3>
                   <p className="text-[10px] text-slate-400 uppercase font-medium">Return to core analytics</p>
                </div>
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all">
                   <ChevronRight className="w-4 h-4" />
                </div>
             </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default VendorProducts
