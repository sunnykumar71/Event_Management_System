import { useEffect, useState } from 'react'
import { userAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import BackButton from '../../components/BackButton.jsx'

const GuestList = () => {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventName: '',
    status: 'invited',
    notes: '',
  })

  useEffect(() => {
    fetchGuests()
  }, [])

  const fetchGuests = async () => {
    try {
      const response = await userAPI.getGuestList()
      setGuests(response.data.guests || [])
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await userAPI.addGuest(formData)
      toast.success('Guest logged')
      setShowAddModal(false)
      setFormData({ name: '', email: '', phone: '', eventName: '', status: 'invited', notes: '' })
      fetchGuests()
    } catch (error) {
      toast.error('Operation failed')
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      await userAPI.updateGuest(selectedGuest._id, formData)
      toast.success('Record updated')
      setShowEditModal(false)
      setSelectedGuest(null)
      fetchGuests()
    } catch (error) {
      toast.error('Update failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove guest from registry?')) return
    try {
      await userAPI.deleteGuest(id)
      toast.success('Guest purged')
      fetchGuests()
    } catch (error) {
      toast.error('Deletion failed')
    }
  }

  const openEditModal = (guest) => {
    setSelectedGuest(guest)
    setFormData({
      name: guest.name,
      email: guest.email,
      phone: guest.phone || '',
      eventName: guest.eventName,
      status: guest.status,
      notes: guest.notes || '',
    })
    setShowEditModal(true)
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <BackButton />
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          + REGISTER GUEST
        </button>
      </div>

      <header className="page-header">
        <h1 className="page-title">GUEST REGISTRY</h1>
        <p className="page-subtitle">Maintain attendee list and invitation status</p>
      </header>

      {loading ? (
        <div className="p-8 text-center text-xs font-mono text-slate-400">QUERYING_ATTENDEE_DATA...</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ATTENDEE_NAME</th>
                <th>EVENT_CONTEXT</th>
                <th>CONTACT_INFO</th>
                <th>RSVP_STATUS</th>
                <th className="text-right">OPERATIONS</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest._id}>
                  <td>
                    <div className="font-bold text-slate-900 uppercase tracking-tight">{guest.name}</div>
                    {guest.notes && <div className="text-[9px] text-slate-400 uppercase italic">Notes: {guest.notes}</div>}
                  </td>
                  <td className="text-xs uppercase">{guest.eventName}</td>
                  <td>
                    <div className="text-[10px] font-mono lowercase">{guest.email}</div>
                    {guest.phone && <div className="text-[10px] font-mono">{guest.phone}</div>}
                  </td>
                  <td>
                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded uppercase tracking-tighter ${
                      guest.status === 'confirmed' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' :
                      guest.status === 'declined' ? 'border-red-200 text-red-600 bg-red-50' :
                      'border-amber-200 text-amber-600 bg-amber-50'
                    }`}>
                      {guest.status}
                    </span>
                  </td>
                  <td className="text-right space-x-4">
                    <button onClick={() => openEditModal(guest)} className="text-slate-900 font-bold text-xs hover:underline uppercase">Edit</button>
                    <button onClick={() => handleDelete(guest._id)} className="text-red-600 font-bold text-xs hover:underline uppercase">Purge</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {guests.length === 0 && (
            <div className="p-12 text-center text-xs text-slate-400 uppercase tracking-widest">No guest records found in registry</div>
          )}
        </div>
      )}

      {/* Simplified Modal Overlay System */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-grayscale flex items-center justify-center z-[100] p-4">
          <div className="card w-full max-w-sm shadow-2xl">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">
              {showAddModal ? 'Register Guest' : 'Modify Guest Record'}
            </h3>
            <form onSubmit={showAddModal ? handleAdd : handleEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Event Context</label>
                  <input
                    type="text"
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Point</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input font-mono"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Handle</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input font-mono"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Lifecycle Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input text-xs font-bold"
                >
                  <option value="invited">INVITED</option>
                  <option value="confirmed">CONFIRMED</option>
                  <option value="declined">DECLINED</option>
                  <option value="attended">ATTENDED</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Internal Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input h-16 resize-none text-xs"
                />
              </div>
              <div className="flex flex-col gap-2 pt-4">
                <button type="submit" className="btn-primary py-2 uppercase font-bold tracking-widest text-xs">
                  {showAddModal ? 'Commit_Registration' : 'Sync_Modifications'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }} 
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest"
                >
                  Cancel / Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuestList
