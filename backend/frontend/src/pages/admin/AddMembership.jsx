import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import BackButton from '../../components/BackButton.jsx'

const AddMembership = () => {
  const [vendors, setVendors] = useState([])
  const [selectedVendor, setSelectedVendor] = useState('')
  const [duration, setDuration] = useState('6 months')
  const [loading, setLoading] = useState(false)
  const [fetchingVendors, setFetchingVendors] = useState(true)

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const response = await adminAPI.getVendors()
      const vendorsWithoutMembership = response.data.vendors?.filter(
        v => !v.membership || v.membership.length === 0
      ) || []
      setVendors(vendorsWithoutMembership)
    } catch (error) {
      toast.error('Sync error')
    } finally {
      setFetchingVendors(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedVendor) {
      toast.error('Vendor selection required')
      return
    }

    setLoading(true)
    try {
      await adminAPI.addMembership({
        vendorId: selectedVendor,
        duration,
      })
      toast.success('Membership activated')
      setSelectedVendor('')
      fetchVendors()
    } catch (error) {
      toast.error('Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const durations = [
    { value: '6 months', price: '$50' },
    { value: '1 year', price: '$90' },
    { value: '2 years', price: '$160' },
  ]

  return (
    <div className="page-container max-w-2xl">
      <div className="mb-6">
        <BackButton />
      </div>

      <header className="page-header">
        <h1 className="page-title">MEMBERSHIP ISSUANCE</h1>
        <p className="page-subtitle">Assign system privileges to business vendors</p>
      </header>

      <div className="card">
        {fetchingVendors ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400">QUERYING_VENDORS...</div>
        ) : vendors.length > 0 ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Target Vendor</label>
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="input"
                required
              >
                <option value="">-- SELECT VENDOR FROM LIST --</option>
                {vendors.map((vendor) => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.name.toUpperCase()} // {vendor.email}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-2 italic">Note: Only vendors without active plans are indexed here.</p>
            </div>

            <div className="form-group">
              <label className="form-label">Duration Plan</label>
              <div className="grid grid-cols-1 gap-2">
                {durations.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-colors ${
                      duration === option.value
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="duration"
                        value={option.value}
                        checked={duration === option.value}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-4 h-4 accent-slate-900"
                      />
                      <span className="text-xs font-bold uppercase">{option.value}</span>
                    </div>
                    <span className="font-mono text-xs">{option.price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-500 flex flex-col gap-1">
              <span className="font-bold">VALIDATION LOG:</span>
              <span>- 6 months is the minimum duration.</span>
              <span>- Vendor ID verification is required before commit.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 font-bold uppercase tracking-widest text-xs"
            >
              {loading ? 'PROCESSING_COMMIT...' : 'FINALIZE MEMBERSHIP'}
            </button>
          </form>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-100 rounded">
            Null Result: All Vendors have active memberships.
          </div>
        )}
      </div>
    </div>
  )
}

export default AddMembership
