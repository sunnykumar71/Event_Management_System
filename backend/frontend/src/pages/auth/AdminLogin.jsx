import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import { ShieldCheck, Mail, Lock, Key } from 'lucide-react'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await authAPI.adminLogin(email, password)
      login(response.data, response.data.token)
      toast.success('Admin authenticated')
      navigate('/admin/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container max-w-md">
      <header className="mb-10 text-center">
        <div className="inline-flex p-3 bg-purple-50 text-purple-600 rounded-2xl mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Admin Entry</h1>
        <p className="text-sm text-slate-500 font-medium uppercase tracking-widest mt-1">Maintenance & Records Terminal</p>
      </header>

      <div className="card shadow-xl border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label flex items-center gap-2 text-purple-600">
              <Mail className="w-3 h-3" /> System Identifier
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="input pl-4 border-slate-100 bg-slate-50/30 focus:bg-white" 
              placeholder="root@system"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label flex items-center gap-2 text-purple-600">
              <Lock className="w-3 h-3" /> Root Password
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
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] bg-purple-600 border-purple-600 hover:bg-purple-700"
          >
            {loading ? 'AUTHENTICATING...' : (
              <>
                <Key className="w-4 h-4" /> Authorize Session
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">
            New admin? <Link to="/admin/signup" className="text-purple-600 font-bold hover:underline">Register Root</Link>
          </p>
        </div>
      </div>

    </div>
  )
}

export default AdminLogin
