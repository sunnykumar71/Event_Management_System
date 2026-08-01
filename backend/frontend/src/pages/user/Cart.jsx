import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import BackButton from '../../components/BackButton.jsx'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  ChevronRight,
  Package,
  Store
} from 'lucide-react'

const Cart = () => {
  const [cart, setCart] = useState([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const updateQuantity = (productId, delta) => {
    const newCart = cart.map(item => {
      if (item.productId === productId) {
        const newQuantity = item.quantity + delta
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
      }
      return item
    }).filter(item => item.quantity > 0)
    
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.productId !== productId)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    toast.success('Removed from Buffer')
  }

  const clearCart = () => {
    if (!confirm('Clear all items from buffer?')) return
    setCart([])
    localStorage.removeItem('cart')
    toast.success('Buffer Purged')
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <div className="page-container">
      <div className="mb-8 flex justify-between items-center">
        <BackButton />
        {cart.length > 0 && (
          <button 
            onClick={clearCart} 
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all uppercase tracking-widest"
          >
            <Trash2 className="w-3.5 h-3.5" /> Purge Buffer
          </button>
        )}
      </div>

      <header className="page-header flex items-center gap-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
           <ShoppingCart className="w-6 h-6" />
        </div>
        <div>
          <h1 className="page-title">Cart Buffer</h1>
          <p className="page-subtitle uppercase tracking-widest text-[10px] font-bold text-slate-400">Temporary storage for selected authorized solutions</p>
        </div>
      </header>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="table-container shadow-xl shadow-slate-200/50">
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.productId}>
                      <td className="py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.name}</span>
                          <button 
                            onClick={() => removeFromCart(item.productId)}
                            className="flex items-center gap-1 text-[9px] font-black text-red-400 hover:text-red-600 uppercase transition-colors"
                          >
                            <Trash2 className="w-2.5 h-2.5" /> [Remove_Entry]
                          </button>
                        </div>
                      </td>
                      <td className="font-mono text-xs font-bold text-slate-500">${item.price.toFixed(2)}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.productId, -1)} className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-sm active:scale-95 transition-all">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-black w-6 text-center text-slate-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, 1)} className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-sm active:scale-95 transition-all">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className="font-mono text-sm font-black text-slate-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
          </div>

          <div>
            <div className="card sticky top-24 border-t-4 border-t-slate-900 shadow-2xl shadow-slate-900/10">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <CreditCard className="w-3 h-3" /> Final Settlement
              </h2>
              
              <div className="space-y-4 font-mono text-xs mb-10">
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-slate-400 uppercase font-bold tracking-tighter">Subtotal:</span>
                  <span className="text-slate-900 font-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-slate-400 uppercase font-bold tracking-tighter">Shipping:</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px]">
                    FREE
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-slate-400 uppercase font-bold tracking-tighter">Tax (10%):</span>
                  <span className="text-slate-900 font-black">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-6 flex justify-between items-end">
                  <span className="font-black text-slate-900 uppercase text-sm tracking-wider">Total:</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tighter">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/user/checkout"
                className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
              >
                Commit to Checkout <ChevronRight className="w-4 h-4" />
              </Link>
              
            </div>
          </div>
        </div>
      ) : (
        <div className="p-20 text-center border-4 border-dashed border-slate-100 rounded-3xl flex flex-col items-center gap-6">
          <div className="p-6 bg-slate-50 rounded-full">
            <Package className="w-12 h-12 text-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-black text-slate-400 uppercase tracking-widest">Your Cart is Empty</div>
            <p className="text-xs text-slate-300 uppercase font-bold">Add some products to get started</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link to="/user/vendors" className="btn-secondary px-8 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
               <Store className="w-3.5 h-3.5" /> Global_Vendors
            </Link>
            <Link to="/user/products" className="btn-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-900/10">
               <Package className="w-3.5 h-3.5" /> Global_Catalog
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
