import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopez_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authApi = {
  login: (data) => api.post('/login', data),
  register: (data) => api.post('/register', data),
}
export const productApi = {
  list: (params = {}) => api.get('/products', { params }),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
}
export const cartApi = { list: () => api.get('/cart'), add: (data) => api.post('/cart', data), remove: (id) => api.delete(`/cart/${id}`) }
export const orderApi = {
  create: (data) => api.post('/orders', data), mine: () => api.get('/orders/my'),
  cancel: (id) => api.put(`/orders/${id}/cancel`), all: () => api.get('/orders'),
  setStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
}
export const adminApi = { stats: () => api.get('/admin/stats'), banner: () => api.get('/admin/banner'), setBanner: (data) => api.put('/admin/banner', data), users: () => api.get('/users') }
export const errorMessage = (error) => error?.response?.data?.message || error?.message || 'Terjadi kesalahan. Coba lagi.'
export default api
