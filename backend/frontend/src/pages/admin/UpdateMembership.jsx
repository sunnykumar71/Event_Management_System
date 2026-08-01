import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import BackButton from '../../components/BackButton.jsx'

const UpdateMembership = () => {
  const [vendors, setVendors] = useState([])
  const [selectedVendor, setSelectedVendor] = useState('')
  const [membership, setMembership] = useState(null)
  const [action, setAction] = useState('extend')
  const [duration, setDuration] = useState('6 months')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchVendorsWithMembership()
  }, [])

  const fetchVendorsWithMembership = async () => {
    try {
      const response = await adminAPI.getVendors()
      const vendorsWithMembership = response.data.vendors?.filter(
        v => v.membership && v.membership.length > 0
      ) || []
      setVendors(vendorsWithMembership)
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setFetching(false)
    }
  }

  const handleVendorSelect = (vendorId) => {
    setSelectedVendor(vendorId)
    const vendor = vendors.find(v => v._id === vendorId)
    if (vendor && vendor.membership && vendor.membership.length > 0) {
      setMembership(vendor.membership[0])
    } else {
      setMembership(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedVendor || !membership) {
      toast.error('Selection required')
      return
    }

    setLoading(true)
    try {
      await adminAPI.updateMembership(membership._id, {
        action,
        duration: action === 'extend' ? duration : undefined,
      })
      toast.success(`Action: ${action.toUpperCase()} - Complete`)
      setSelectedVendor('')
      setMembership(null)
      fetchVendorsWithMembership()
    } catch (error) {
      toast.error('Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const durations = [
    { value: '6 months', label: '6 MONTHS (DEFAULT)' },
    { value: '1 year', label: '1 YEAR' },
    { value: '2 years', label: '2 YEARS' },
  ]

  return (
    <div className="page-container max-w-2xl">
      <div className="mb-6">
        <BackButton />
      </div>

      <header className="page-header">
        <h1 className="page-title">MEMBERSHIP UPDATE</h1>
        <p className="page-subtitle">Modify lifecycle or extension of vendor plans</p>
      </header>

      <div className="card">
        {fetching ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400">QUERYING_ACTIVE_PLANS...</div>
        ) : vendors.length > 0 ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Active Membership Record</label>
              <select
                value={selectedVendor}
                onChange={(e) => handleVendorSelect(e.target.value)}
                className="input font-mono text-xs"
                required
              >
                <option value="">-- SELECT RECORD --</option>
                {vendors.map((vendor) => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.name.toUpperCase()} (ID: {vendor.membership[0]?._id?.slice(-6)}) 
                    [EXP: {new Date(vendor.membership[0]?.endDate).toLocaleDateString()}]
                  </option>
                ))}
              </select>
            </div>

            {membership && (
              <div className="p-4 bg-slate-900 text-white rounded font-mono text-[10px] space-y-1">
                <p className="text-slate-400 mb-2 font-bold uppercase tracking-widest border-b border-slate-800 pb-1">Current Metadata</p>
                <p>STATUS: {membership.status.toUpperCase()}</p>
                <p>PLAN_TYPE: {membership.duration.toUpperCase()}</p>
                <p>START_DATE: {new Date(membership.startDate).toISOString()}</p>
                <p>END_DATE: {new Date(membership.endDate).toISOString()}</p>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Update Directive</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAction('extend')}
                  className={`py-2 text-[10px] font-bold uppercase tracking-widest border rounded transition-colors ${
                    action === 'extend' ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-400 hover:border-slate-400'
                  }`}
                >
                  EXTEND_PLAN
                </button>
                <button
                  type="button"
                  onClick={() => setAction('cancel')}
                  className={`py-2 text-[10px] font-bold uppercase tracking-widest border rounded transition-colors ${
                    action === 'cancel' ? 'bg-red-600 border-red-600 text-white' : 'border-slate-200 text-slate-400 hover:border-red-400'
                  }`}
                >
                  CANCEL_PLAN
                </button>
              </div>
            </div>

            {action === 'extend' && (
              <div className="form-group">
                <label className="form-label">Extension Delta</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="input text-xs font-bold"
                >
                  {durations.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-bold uppercase tracking-widest text-xs rounded transition-colors ${
                action === 'cancel' ? 'bg-red-600 text-white hover:bg-red-700' : 'btn-primary'
              }`}
            >
              {loading ? 'PROCESSING_UPDATE...' : `COMMIT_${action.toUpperCase()}`}
            </button>
          </form>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-100 rounded">
            Null Result: No active memberships found for update.
          </div>
        )}
      </div>
    </div>
  )
}

export default UpdateMembership
