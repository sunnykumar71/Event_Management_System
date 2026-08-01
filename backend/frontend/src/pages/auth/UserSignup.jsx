import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { authAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import { UserPlus, Mail, Lock, User, CheckCircle2 } from 'lucide-react'

const UserSignup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast.error('All fields required')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords mismatch')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.userSignup(name, email, password)
      login(response.data, response.data.token)
      toast.success('Account created')
      navigate('/user/portal')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container max-w-md">
      <header className="mb-10 text-center">
        <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4">
          <UserPlus className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">User Registration</h1>
        <p className="text-sm text-slate-500 font-medium uppercase tracking-widest mt-1">Initialize Personal Session Profile</p>
      </header>

      <div className="card shadow-xl border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label flex items-center gap-2 text-blue-600">
              <User className="w-3 h-3" /> Full Identity Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input pl-4 border-slate-100 placeholder:lowercase"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label flex items-center gap-2 text-blue-600">
              <Mail className="w-3 h-3" /> Email Designation
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-4 border-slate-100 placeholder:lowercase"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label flex items-center gap-2 text-blue-600">
                <Lock className="w-3 h-3" /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-4 border-slate-100"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label flex items-center gap-2 text-blue-600">
                <Lock className="w-3 h-3" /> Confirm
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input pl-4 border-slate-100"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em]"
          >
            {loading ? 'CREATING...' : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">
            Already have an account? <Link to="/user/login" className="text-blue-600 hover:underline">Login here</Link>
          </p>
        </div>
      </div>

    </div>
  )
}

export default UserSignup
