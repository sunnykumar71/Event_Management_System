import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api.js'
import toast from 'react-hot-toast'
import BackButton from '../../components/BackButton.jsx'

const MaintainUser = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers()
      setUsers(response.data.users || [])
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.createUser(formData)
      toast.success('User registered')
      setShowAddModal(false)
      setFormData({ name: '', email: '', password: '' })
      fetchUsers()
    } catch (error) {
      toast.error('Creation failed')
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.updateUser(selectedUser._id, { name: formData.name, email: formData.email })
      toast.success('User updated')
      setShowEditModal(false)
      setSelectedUser(null)
      setFormData({ name: '', email: '', password: '' })
      fetchUsers()
    } catch (error) {
      toast.error('Update failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Proceed with deletion?')) return
    try {
      await adminAPI.deleteUser(id)
      toast.success('User removed')
      fetchUsers()
    } catch (error) {
      toast.error('Deletion failed')
    }
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setFormData({ name: user.name, email: user.email, password: '' })
    setShowEditModal(true)
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <BackButton />
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          + NEW USER
        </button>
      </div>

      <header className="page-header">
        <h1 className="page-title">USER REPOSITORY</h1>
        <p className="page-subtitle">Maintenance of system authenticated users</p>
      </header>

      {loading ? (
        <div className="p-8 text-center text-xs font-mono text-slate-400">LOADING_DATABASE_RECORDS...</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>FULL NAME</th>
                <th>IDENTIFIER (EMAIL)</th>
                <th>ENTRY DATE</th>
                <th className="text-right">OPERATIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="font-medium text-slate-900">{user.name}</td>
                  <td className="font-mono text-xs">{user.email}</td>
                  <td className="text-xs uppercase">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="text-right space-x-4">
                    <button onClick={() => openEditModal(user)} className="text-slate-900 font-bold text-xs hover:underline uppercase">Edit</button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-600 font-bold text-xs hover:underline uppercase">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-12 text-center text-xs text-slate-400 uppercase tracking-widest">No entries found in repository</div>
          )}
        </div>
      )}

      {/* Simplified Modal Overlay System */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-grayscale flex items-center justify-center z-[100] p-4">
          <div className="card w-full max-w-sm shadow-2xl">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">
              {showAddModal ? 'Register New Entry' : 'Modify Existing Entry'}
            </h3>
            <form onSubmit={showAddModal ? handleAdd : handleEdit} className="space-y-4">
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
                <label className="form-label">Email Handle</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  required
                />
              </div>
              {showAddModal && (
                <div className="form-group">
                  <label className="form-label">Initial Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 pt-4">
                <button type="submit" className="btn-primary py-2 uppercase font-bold tracking-widest text-xs">
                  {showAddModal ? 'Commit Registration' : 'Save Modifications'}
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

export default MaintainUser
