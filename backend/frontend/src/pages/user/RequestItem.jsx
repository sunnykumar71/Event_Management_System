import { useState, useEffect } from 'react'
import { userAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import BackButton from '../../components/BackButton.jsx'

const RequestItem = () => {
  const [vendors, setVendors] = useState([])
  const [userRequests, setUserRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingVendors, setFetchingVendors] = useState(true)
  const [fetchingRequests, setFetchingRequests] = useState(true)
  const [formData, setFormData] = useState({
    vendorId: '',
    productName: '',
    description: '',
    expectedPrice: '',
    quantity: 1,
  })

  useEffect(() => {
    fetchVendors()
    fetchMyRequests()
  }, [])

  const fetchMyRequests = async () => {
    try {
      const response = await userAPI.getProductRequests()
      setUserRequests(response.data.requests || [])
    } catch (error) {
      console.error('Request fetch failed')
    } finally {
      setFetchingRequests(false)
    }
  }

  const fetchVendors = async () => {
    try {
      const response = await userAPI.getVendors()
      setVendors(response.data.vendors || [])
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setFetchingVendors(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.vendorId || !formData.productName || !formData.description) {
      toast.error('All fields mandatory')
      return
    }

    setLoading(true)
    try {
      await userAPI.requestProduct({
        vendorId: formData.vendorId,
        productName: formData.productName,
        description: formData.description,
        expectedPrice: parseFloat(formData.expectedPrice) || 0,
        quantity: parseInt(formData.quantity) || 1,
      })
      
      toast.success('Inquiry Logged')
      setFormData({
        vendorId: '',
        productName: '',
        description: '',
        expectedPrice: '',
        quantity: 1,
      })
      fetchMyRequests()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Inquiry failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>

      <header className="page-header">
        <h1 className="page-title">CUSTOM_INQUIRY_PROTOCOL</h1>
        <p className="page-subtitle">Initialize a special request for a specific vendor unit</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card h-fit">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
             TRANSMISSION_FORM
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Target Vendor (Select)</label>
              {fetchingVendors ? (
                <div className="animate-pulse h-10 bg-slate-100 rounded"></div>
              ) : (
                <select
                  value={formData.vendorId}
                  onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                  className="input text-xs font-bold"
                  required
                >
                  <option value="">-- SELECT_AUTHORIZED_VENDOR --</option>
                  {vendors.map((vendor) => (
                    <option key={vendor._id} value={vendor._id}>
                      {vendor.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Item Designation (Name)</label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="input"
                placeholder="E.G. CUSTOM_STAGING_UNIT"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Technical Specification (Description)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input h-32 resize-none text-xs"
                placeholder="DESCRIBE_REQUEST_PARAMETERS_AND_TERMS..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Expected Valuation (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.expectedPrice}
                  onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                  className="input font-mono"
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="input font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-widest"
            >
              {loading ? 'TRANSMITTING_STREAMS...' : 'INITIALIZE_REQUEST'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card min-h-[500px]">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               INQUIRY_MONITORING_DAEMON
            </h2>
            
            {fetchingRequests ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="animate-pulse flex flex-col gap-2 p-3 border border-slate-50 rounded-lg">
                    <div className="h-2 w-24 bg-slate-100 rounded"></div>
                    <div className="h-3 w-48 bg-slate-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : userRequests.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {userRequests.map((req) => (
                  <div key={req._id} className="p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-all bg-slate-50/50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{req.vendorId?.name || 'VENDOR_UNIT'}</div>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">{req.productName}</h3>
                      </div>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${
                        req.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        req.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                        'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed mb-3 line-clamp-2 uppercase italic">{req.description}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <div className="text-[9px] font-mono text-slate-400">QTY: {req.quantity}</div>
                      <div className="text-[11px] font-mono font-black text-slate-900">${req.expectedPrice.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <div className="text-[10px] font-black uppercase tracking-[0.2em]">NO_ACTIVE_STREAM</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestItem
