import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { userAPI } from '../../services/api.js'
import BackButton from '../../components/BackButton.jsx'

const Checkout = () => {
  const [cart] = useState(() => {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart buffer is empty')
      return
    }

    setLoading(true)
    try {
      const items = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))

      await userAPI.createOrder({ items })
      localStorage.removeItem('cart')
      toast.success('Transaction Finalized')
      navigate('/user/order-success')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="card text-center max-w-sm">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Null_Checkout_Buffer</h2>
          <p className="text-xs text-slate-500 uppercase mb-8">No items found in the current session buffer.</p>
          <button
            onClick={() => navigate('/user/products')}
            className="btn-primary w-full py-2 text-[10px] font-bold uppercase tracking-widest"
          >
            EXECUTE_CATALOG_QUERY
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container max-w-2xl">
      <div className="mb-6">
        <BackButton />
      </div>

      <header className="page-header">
        <h1 className="page-title">ORDER_CHECKOUT_PROTOCOL</h1>
        <p className="page-subtitle">Final validation and payment authorization for the current buffer</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Manifest Summary</h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between text-[11px] uppercase tracking-tight">
                  <span className="text-slate-600 font-bold">{item.name} <span className="text-slate-400 font-normal">x{item.quantity}</span></span>
                  <span className="font-mono text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-sm">
                <span className="text-slate-900 uppercase">AGGREGATE:</span>
                <span className="text-slate-900">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="card border-t-4 border-t-slate-900">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Payment Gateway (Simulated)</h2>
            <form className="space-y-4">
              <div className="form-group">
                <label className="form-label">Terminal_Card_Number</label>
                <input type="text" placeholder="#### #### #### ####" className="input font-mono" disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">EXP_DATE</label>
                  <input type="text" placeholder="MM/YY" className="input font-mono" disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">SEC_CODE</label>
                  <input type="password" placeholder="***" className="input font-mono" disabled />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={loading}
                  className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-widest"
                >
                  {loading ? 'PROCESSING_ENCRYPTION...' : `AUTHORIZE_$${totalAmount.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
