import { useState } from 'react'
import { vendorAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../components/BackButton.jsx'

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.description) {
      toast.error('All fields mandatory')
      return
    }

    setLoading(true)
    try {
      await vendorAPI.addProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
      })
      toast.success('Inventory Updated')
      navigate('/vendor/products')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container max-w-2xl">
      <div className="mb-6">
        <BackButton />
      </div>

      <header className="page-header">
        <h1 className="page-title">NEW ITEM REGISTRATION</h1>
        <p className="page-subtitle">Append new product to the business catalog</p>
      </header>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label">Item Designation (Name)</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              className="input" 
              placeholder="E.G. PHOTOGRAPHY_UNIT_01"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Unit Valuation (Price in USD)</label>
            <input 
              type="number" 
              step="0.01" 
              min="0.01" 
              value={formData.price} 
              onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
              className="input font-mono" 
              placeholder="0.00"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Technical Specification (Description)</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              className="input h-32 resize-none text-xs leading-relaxed" 
              placeholder="DESCRIBE_ITEM_CAPABILITIES_AND_TERMS..."
              required 
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-500 uppercase tracking-widest flex flex-col gap-1">
            <span className="font-bold">Protocol:</span>
            <span>- Ensure item name is unique within current catalog.</span>
            <span>- Valuation must be numerically positive.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 font-bold uppercase tracking-widest text-xs"
          >
            {loading ? 'SYNCING_TO_DATABASE...' : 'COMMIT_NEW_ITEM'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddItem
