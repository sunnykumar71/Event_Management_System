import { useEffect, useState } from 'react'
import { userAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import BackButton from '../../components/BackButton.jsx'

const ViewVendors = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const response = await userAPI.getVendors()
      setVendors(response.data.vendors || [])
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <BackButton />
      </div>

      <header className="page-header">
        <h1 className="page-title">VENDOR DIRECTORY</h1>
        <p className="page-subtitle">Authorized service providers and event partners</p>
      </header>

      {loading ? (
        <div className="p-8 text-center text-xs font-mono text-slate-400">QUERYING_VENDOR_NETWORK...</div>
      ) : vendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor._id} className="card flex flex-col border-l-2 border-l-slate-900">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{vendor.name}</h3>
                <p className="text-[10px] font-mono text-slate-500 lowercase">{vendor.email}</p>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {vendor.membership && vendor.membership.length > 0 ? (
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase border border-emerald-100">
                      Verified_Status
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase border border-slate-100">
                      Standard_Tier
                    </span>
                  )}
                </div>
                
                <Link
                  to="/user/products"
                  className="text-[10px] font-bold text-slate-900 hover:underline uppercase tracking-widest"
                >
                  OPEN_CATALOG →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-100 rounded">
          Null Result: No vendors currently broadcasting services.
        </div>
      )}

    </div>
  )
}

export default ViewVendors
