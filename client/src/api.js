import axios from 'axios'
import {
  demoAdminApi,
  demoAuth,
  demoCartApi,
  demoOrderApi,
  demoProductsApi,
  enableDemoMode,
  isDemoMode,
} from './demoStore'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopez_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const isBackendUnavailable = (error) => error?.code === 'ERR_NETWORK' || error?.message === 'Network Error' || Number(error?.response?.status) >= 500
const withDemoFallback = async (request, fallback) => {
  if (isDemoMode()) return fallback()
  try {
    return await request()
  } catch (error) {
    if (!isBackendUnavailable(error)) throw error
    enableDemoMode()
    return fallback()
  }
}

export const authApi = {
  async login(data) {
    if (isDemoMode()) return demoAuth.login(data)
    try {
      return await api.post('/login', data)
    } catch (error) {
      if (!isBackendUnavailable(error)) throw error
      enableDemoMode()
      return demoAuth.login(data)
    }
  },
  async register(data) {
    if (isDemoMode()) return demoAuth.register(data)
    try {
      return await api.post('/register', data)
    } catch (error) {
      if (!isBackendUnavailable(error)) throw error
      enableDemoMode()
      return demoAuth.register(data)
    }
  },
}

export const productApi = {
  list: (params = {}) => isDemoMode() ? Promise.resolve(demoProductsApi.list(params)) : api.get('/products', { params }),
  get: (id) => isDemoMode() ? Promise.resolve(demoProductsApi.get(id)) : api.get(`/products/${id}`),
  create: (data) => withDemoFallback(() => api.post('/products', data), () => demoProductsApi.create(data)),
  update: (id, data) => withDemoFallback(() => api.put(`/products/${id}`, data), () => demoProductsApi.update(id, data)),
  remove: (id) => withDemoFallback(() => api.delete(`/products/${id}`), () => demoProductsApi.remove(id)),
}

export const cartApi = {
  list: () => withDemoFallback(() => api.get('/cart'), () => demoCartApi.list()),
  add: (data) => withDemoFallback(() => api.post('/cart', data), () => demoCartApi.add(data)),
  remove: (id) => withDemoFallback(() => api.delete(`/cart/${id}`), () => demoCartApi.remove(id)),
}

export const orderApi = {
  create: (data) => withDemoFallback(() => api.post('/orders', data), () => demoOrderApi.create(data)),
  mine: () => withDemoFallback(() => api.get('/orders/my'), () => demoOrderApi.mine()),
  cancel: (id) => withDemoFallback(() => api.put(`/orders/${id}/cancel`), () => demoOrderApi.cancel(id)),
  all: () => withDemoFallback(() => api.get('/orders'), () => demoOrderApi.all()),
  setStatus: (id, status) => withDemoFallback(() => api.put(`/orders/${id}/status`, { status }), () => demoOrderApi.setStatus(id, status)),
}

export const adminApi = {
  stats: () => withDemoFallback(() => api.get('/admin/stats'), () => demoAdminApi.stats()),
  banner: () => withDemoFallback(() => api.get('/admin/banner'), () => demoAdminApi.banner()),
  setBanner: (data) => withDemoFallback(() => api.put('/admin/banner', data), () => demoAdminApi.setBanner(data)),
  users: () => withDemoFallback(() => api.get('/users'), () => demoAdminApi.users()),
}

export const errorMessage = (error) => error?.response?.data?.message || error?.message || 'Terjadi kesalahan. Coba lagi.'
export default api
