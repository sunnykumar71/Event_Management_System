import { useEffect, useState } from 'react'
import { userAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import BackButton from '../../components/BackButton.jsx'
import { useNavigate } from 'react-router-dom'
import { 
  ShoppingCart, 
  Package, 
  Plus, 
  Minus, 
  Store, 
  Activity, 
  Search, 
  Box,
  ChevronRight
} from 'lucide-react'

const ViewProducts = () => {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await userAPI.getProducts()
      setProducts(response.data.products || [])
    } catch (error) {
      toast.error('Data sync failed')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product._id)
    let newCart
    
    if (existingItem) {
      newCart = cart.map(item =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      newCart = [...cart, { productId: product._id, name: product.name, price: product.price, quantity: 1 }]
    }
    
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    toast.success('Added to Cart')
  }

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

  const getCartItem = (productId) => cart.find(item => item.productId === productId)

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="page-container">
      <div className="mb-8 flex justify-between items-center">
        <BackButton />
        {cart.length > 0 && (
          <button 
            onClick={() => navigate('/user/cart')}
            className="btn-primary px-6 py-2.5 text-xs font-black uppercase tracking-[0.15em] flex items-center gap-3 shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4" /> 
            View Cart (${cartTotal.toFixed(2)})
          </button>
        )}
      </div>

      <header className="page-header flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
           <Package className="w-6 h-6" />
        </div>
        <div>
          <h1 className="page-title">Global Catalog</h1>
          <p className="page-subtitle uppercase tracking-widest text-[10px] font-bold text-slate-400">Available event solutions and equipment</p>
        </div>
      </header>

      {loading ? (
        <div className="p-20 text-center flex flex-col items-center gap-4">
          <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Loading Catalog...</div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const cartItem = getCartItem(product._id)
            
            return (
              <div key={product._id} className="card group flex flex-col border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-mono text-xs font-black border border-emerald-100">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase tracking-tight line-clamp-3 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] border-t border-slate-50 pt-3">
                    <Store className="w-3 h-3" />
                    <span>{product.vendorId?.name || 'Vendor'}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  {cartItem ? (
                    <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateQuantity(product._id, -1)} 
                          className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-600 hover:border-red-200 transition-all shadow-sm active:scale-95"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-black w-6 text-center text-slate-900">
                          {cartItem.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(product._id, 1)} 
                          className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full btn-secondary py-3 flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-20 text-center border-4 border-dashed border-slate-100 rounded-3xl flex flex-col items-center gap-4">
          <Search className="w-12 h-12 text-slate-200" />
          <div className="text-sm font-black text-slate-300 uppercase tracking-widest">
            Catalog is Empty
          </div>
        </div>
      )}
      
      <div className="mt-16 bg-slate-900 text-white rounded-2xl p-6 shadow-2xl shadow-slate-900/30 font-mono text-[10px] uppercase flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="font-bold tracking-widest uppercase">Cart Status: {cart.length > 0 ? 'Active' : 'Empty'}</span>
        </div>
        <div className="flex items-center gap-6 relative z-10">
           <span className="text-slate-500">Total Valuation:</span>
           <span className="text-xl font-black text-white">${cartTotal.toFixed(2)}</span>
           <button 
             onClick={() => navigate('/user/cart')}
             className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
           >
             <ChevronRight className="w-4 h-4" />
           </button>
        </div>
        <Box className="absolute -left-10 -bottom-10 w-48 h-48 text-white/[0.03] -rotate-12" />
      </div>
    </div>
  )
}

export default ViewProducts
