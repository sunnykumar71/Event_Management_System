import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  adminLogin: (email, password) => api.post('/auth/admin/login', { email, password }),
  adminSignup: (name, email, password) => api.post('/auth/admin/register', { name, email, password }),
  vendorLogin: (email, password) => api.post('/auth/vendor/login', { email, password }),
  vendorSignup: (name, email, password) => api.post('/auth/vendor/register', { name, email, password }),
  userLogin: (email, password) => api.post('/auth/user/login', { email, password }),
  userSignup: (name, email, password) => api.post('/auth/user/register', { name, email, password }),
}

// Admin APIs
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  createUser: (data) => api.post('/admin/user', data),
  updateUser: (id, data) => api.put(`/admin/user/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
  getVendors: () => api.get('/admin/vendors'),
  createVendor: (data) => api.post('/admin/vendor', data),
  updateVendor: (id, data) => api.put(`/admin/vendor/${id}`, data),
  deleteVendor: (id) => api.delete(`/admin/vendor/${id}`),
  addMembership: (data) => api.post('/admin/membership', data),
  updateMembership: (id, data) => api.put(`/admin/membership/${id}`, data),
}

// Vendor APIs
export const vendorAPI = {
  addProduct: (data) => api.post('/vendor/product', data),
  getProducts: () => api.get('/vendor/products'),
  deleteProduct: (id) => api.delete(`/vendor/product/${id}`),
  getProduct: (id) => api.get(`/vendor/product/${id}`),
  getTransactions: () => api.get('/vendor/transactions'),
  getProductRequests: () => api.get('/vendor/product-requests'),
  respondToRequest: (id, data) => api.put(`/vendor/product-request/${id}`, data),
}

// User APIs
export const userAPI = {
  getVendors: () => api.get('/user/vendors'),
  getProducts: () => api.get('/user/products'),
  addToCart: (data) => api.post('/user/cart', data),
  createOrder: (data) => api.post('/user/order', data),
  getOrders: () => api.get('/user/orders'),
  cancelOrder: (id) => api.put(`/user/order/${id}/cancel`),
  getOrderStatus: (id) => api.get(`/user/order/${id}`),
  getGuestList: () => api.get('/user/guests'),
  addGuest: (data) => api.post('/user/guest', data),
  updateGuest: (id, data) => api.put(`/user/guest/${id}`, data),
  deleteGuest: (id) => api.delete(`/user/guest/${id}`),
  requestProduct: (data) => api.post('/user/product-request', data),
  getProductRequests: () => api.get('/user/product-requests'),
}

export default api
