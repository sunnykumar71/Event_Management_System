import { useEffect, useState } from 'react'
import { userAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import BackButton from '../../components/BackButton.jsx'

const OrderStatus = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await userAPI.getOrders()
      setOrders(response.data.orders || [])
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (orderId) => {
    if (!confirm('Abort transaction and cancel fulfillment?')) return
    try {
      await userAPI.cancelOrder(orderId)
      toast.success('Transaction Aborted')
      fetchOrders()
    } catch (error) {
      toast.error('Cancellation failed')
    }
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <BackButton />
      </div>

      <header className="page-header">
        <h1 className="page-title">ORDER_LIFECYCLE_TRACKING</h1>
        <p className="page-subtitle">Historical records and active fulfillment status</p>
      </header>

      {loading ? (
        <div className="p-8 text-center text-xs font-mono text-slate-400">QUERYING_TRANSACTION_RECORDS...</div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="card border-l-4 border-l-slate-900">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction ID</div>
                  <h3 className="text-xs font-mono font-bold text-slate-900 uppercase">{order._id}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tight">LOGGED: {new Date(order.createdAt).toISOString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold border px-3 py-1 rounded uppercase tracking-tighter ${
                    order.status === 'completed' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' :
                    order.status === 'cancelled' ? 'border-red-200 text-red-600 bg-red-50' :
                    order.status === 'shipped' ? 'border-blue-200 text-blue-600 bg-blue-50' :
                    'border-amber-200 text-amber-600 bg-amber-50'
                  }`}>
                    STATUS: {order.status}
                  </span>
                  {order.status !== 'cancelled' && order.status !== 'completed' && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="text-[10px] font-bold text-red-600 hover:underline uppercase tracking-widest"
                    >
                      ABORT_TRANSACTION
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded mb-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Manifest Items</div>
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-700 uppercase tracking-tight">
                        {item.productId?.name || 'GENERIC_ITEM'} <span className="text-slate-400 font-normal">x {item.quantity}</span>
                      </span>
                      <span className="font-mono text-slate-500">
                        ${(item.productId?.price || 0).toFixed(2)} / unit
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-2">
                <div className="text-[9px] font-mono text-slate-400 uppercase">
                  Encryption_Protocol: AES-256-BIT // Fulfillment_Node: MAIN_HUB
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">AGGREGATE_VALUATION</div>
                  <div className="text-2xl font-mono font-bold text-slate-900">${order.totalAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded">
          <div className="text-xs text-slate-400 uppercase tracking-widest">Null Result: No historical transaction data found.</div>
        </div>
      )}
    </div>
  )
}

export default OrderStatus
