import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { authAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import { Store, Mail, Lock, Briefcase } from 'lucide-react'

const VendorLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Credentials required')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.vendorLogin(email, password)
      login(response.data, response.data.token)
      toast.success('Vendor Portal Access Granted')
      navigate('/vendor/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container max-w-md">
      <header className="mb-10 text-center">
        <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-4">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Vendor Entry</h1>
        <p className="text-sm text-slate-500 font-medium uppercase tracking-widest mt-1">Business Analytics & Catalog Portal</p>
      </header>

      <div className="card shadow-xl border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label flex items-center gap-2 text-emerald-600">
              <Mail className="w-3 h-3" /> Business Identifier
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-4 border-slate-100 bg-slate-50/30 focus:bg-white"
              placeholder="business@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label flex items-center gap-2 text-emerald-600">
              <Lock className="w-3 h-3" /> Credential Key
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-4 border-slate-100 bg-slate-50/30 focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] bg-emerald-600 border-emerald-600 hover:bg-emerald-700"
          >
            {loading ? 'OPENING TUNNEL...' : (
              <>
                <Briefcase className="w-4 h-4" /> Initialize Portal
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">
            New Business? <Link to="/vendor/signup" className="text-emerald-600 font-bold hover:underline">Enroll Now</Link>
          </p>
        </div>
      </div>
      
    </div>
  )
}

export default VendorLogin
