import { useEffect, useState } from 'react'
import { vendorAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import BackButton from '../../components/BackButton.jsx'

const VendorTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await vendorAPI.getTransactions()
      setTransactions(response.data.orders || [])
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <BackButton />
      </div>

      <header className="page-header">
        <h1 className="page-title">TRANSACTION_RECORDS</h1>
        <p className="page-subtitle">Inbound orders containing your catalog items</p>
      </header>

      {loading ? (
        <div className="p-8 text-center text-xs font-mono text-slate-400">QUERYING_TRANSACTION_BUFFER...</div>
      ) : transactions.length > 0 ? (
        <div className="space-y-6">
          {transactions.map((order) => (
            <div key={order._id} className="card border-l-4 border-l-slate-900">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Customer Identification</div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{order.userId?.name || 'ANONYMOUS_USER'}</h3>
                  <p className="text-[10px] font-mono text-slate-500 lowercase">{order.userId?.email || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold border px-2 py-1 rounded uppercase tracking-tighter ${
                    order.status === 'completed' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' :
                    order.status === 'cancelled' ? 'border-red-200 text-red-600 bg-red-50' :
                    'border-amber-200 text-amber-600 bg-amber-50'
                  }`}>
                    LOG_STATUS: {order.status}
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded mb-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Item Manifest</div>
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700 uppercase tracking-tight">
                        {item.productId?.name || 'GENERIC_UNIT'} <span className="text-slate-400 font-normal">x{item.quantity}</span>
                      </span>
                      <span className="font-mono text-slate-500">
                        VAL: ${(item.productId?.price || 0) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-2">
                <div className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">
                  Transaction_Date: {new Date(order.createdAt).toISOString()} // ID: {order._id}
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">AGGREGATE_REVENUE</div>
                  <div className="text-2xl font-mono font-bold text-slate-900">${order.totalAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded">
          <div className="text-xs text-slate-400 uppercase tracking-widest">Null Result: No inbound transaction records to display.</div>
        </div>
      )}
    </div>
  )
}

export default VendorTransactions
