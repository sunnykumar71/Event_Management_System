import { useEffect, useState } from 'react'
import { vendorAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import BackButton from '../../components/BackButton.jsx'

const ProductRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [responseMessage, setResponseMessage] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await vendorAPI.getProductRequests()
      setRequests(response.data.requests || [])
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = async (requestId, status) => {
    try {
      await vendorAPI.respondToRequest(requestId, {
        status,
        responseMessage: responseMessage,
      })
      toast.success(`Action: ${status.toUpperCase()} - Success`)
      setResponseMessage('')
      setSelectedRequest(null)
      fetchRequests()
    } catch (error) {
      toast.error('Operation failed')
    }
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <BackButton />
      </div>

      <header className="page-header">
        <h1 className="page-title">USER REQUESTS</h1>
        <p className="page-subtitle">Inbound inquiries and custom orders from users</p>
      </header>

      {loading ? (
        <div className="p-8 text-center text-xs font-mono text-slate-400">QUERYING_REQUEST_BUFFER...</div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="card border-l-4 border-l-slate-900">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Requester Information</div>
                  <h3 className="text-sm font-bold text-slate-900">{request.userId?.name || 'ANONYMOUS_USER'}</h3>
                  <p className="text-xs font-mono text-slate-500">{request.userId?.email || 'SYSTEM_INTERNAL'}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-1 border rounded uppercase tracking-tighter ${
                    request.status === 'approved' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' :
                    request.status === 'rejected' ? 'border-red-200 text-red-600 bg-red-50' :
                    'border-amber-200 text-amber-600 bg-amber-50'
                  }`}>
                    STATUS: {request.status}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded mb-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Item Specification</div>
                <h4 className="text-sm font-bold mb-1 uppercase tracking-tight">{request.productName}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{request.description}</p>
                <div className="flex gap-6 text-[10px] font-mono">
                  <span className="bg-white px-2 py-1 border border-slate-200 rounded">VALUATION: ${request.expectedPrice}</span>
                  <span className="bg-white px-2 py-1 border border-slate-200 rounded">QUANTITY: {request.quantity}</span>
                </div>
              </div>

              {request.responseMessage && (
                <div className="mb-4 p-3 bg-slate-900 text-white rounded text-[10px] font-mono">
                  <span className="text-slate-400 font-bold mr-2">OUTBOUND_RESPONSE:</span>
                  {request.responseMessage}
                </div>
              )}

              {request.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  {selectedRequest === request._id ? (
                    <div className="space-y-4">
                      <div className="form-group">
                        <label className="form-label">RESPONSE_MESSAGE (STR)</label>
                        <textarea
                          value={responseMessage}
                          onChange={(e) => setResponseMessage(e.target.value)}
                          className="input h-20 resize-none text-xs"
                          placeholder="Type response for the user..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRespond(request._id, 'approved')}
                          className="flex-1 btn-primary py-2 text-[10px] font-bold uppercase tracking-widest"
                        >
                          Commit_Approval
                        </button>
                        <button
                          onClick={() => handleRespond(request._id, 'rejected')}
                          className="flex-1 bg-red-600 text-white rounded py-2 text-[10px] font-bold uppercase tracking-widest"
                        >
                          Reject_Entry
                        </button>
                        <button
                          onClick={() => setSelectedRequest(null)}
                          className="px-4 btn-secondary py-2 text-[10px] font-bold uppercase tracking-widest"
                        >
                          Abort
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedRequest(request._id)}
                      className="w-full btn-secondary py-2 text-[10px] font-bold uppercase tracking-widest"
                    >
                      Process_Request_Buffer
                    </button>
                  )}
                </div>
              )}

              <div className="mt-4 text-[10px] font-mono text-slate-300">
                TIMESTAMP: {new Date(request.createdAt).toISOString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-100 rounded">
          Status: No pending user inquiries in the buffer.
        </div>
      )}
    </div>
  )
}

export default ProductRequests
