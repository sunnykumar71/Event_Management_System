import { Link } from 'react-router-dom'

const OrderSuccess = () => {
  return (
    <div className="page-container flex items-center justify-center min-h-[70vh]">
      <div className="card text-center max-w-md border-t-8 border-t-emerald-500">
        <h1 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">
          TRANSACTION_SUCCESSFUL
        </h1>
        
        <p className="text-xs text-slate-500 uppercase mb-8 leading-relaxed">
          Order authorization complete. The system has synchronized your request with the vendor fulfillment network.
        </p>

        <div className="bg-slate-50 border border-slate-100 rounded p-6 mb-8 text-left">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Post-Transaction Protocol</h2>
          <ul className="text-[10px] text-slate-600 space-y-3 uppercase font-mono">
            <li>[01] SYSTEM_EMAIL_CONFIRMATION_SENT</li>
            <li>[02] VENDOR_NOTIFIED_FOR_DISPATCH_PREPARATION</li>
            <li>[03] REAL-TIME_STATUS_TRACKING_INITIALIZED</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            to="/user/order-status"
            className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-widest text-center"
          >
            EXECUTE_ORDER_TRACKING
          </Link>
          
          <Link
            to="/user/products"
            className="btn-secondary w-full py-3 text-xs font-bold uppercase tracking-widest text-center"
          >
            RETURN_TO_CATALOG
          </Link>
        </div>
        
      </div>
    </div>
  )
}

export default OrderSuccess
