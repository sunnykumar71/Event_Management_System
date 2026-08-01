import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { authAPI } from '../../services/api.js'
import toast from 'react-hot-toast'

const VendorSignup = () => {
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
      toast.error('All fields are mandatory')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Confirm password does not match')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.vendorSignup(name, email, password)
      login(response.data, response.data.token)
      toast.success('Vendor registered successfully')
      navigate('/vendor/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container max-w-sm">
      <header className="page-header">
        <h1 className="page-title">VENDOR ENROLLMENT</h1>
        <p className="page-subtitle">Register your business profile</p>
      </header>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Business Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'ENROLLING...' : 'FINALIZE REGISTRATION'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-tight">
            Already registered? <Link to="/vendor/login" className="text-slate-900 font-bold hover:underline">Vendor Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default VendorSignup
