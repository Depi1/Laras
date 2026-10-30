import { createContext, useContext, useMemo, useState } from 'react'
import { authApi } from '../api'

const AuthContext = createContext(null)
const normalizeUser = (value) => {
  if (!value) return null
  const name = String(value.username || '').trim()
  const username = !name || name.includes('@')
    ? (value.usertype === 'admin' ? 'Admin Laras' : value.email?.split('@')[0] || 'Customer')
    : name
  return { ...value, username }
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return normalizeUser(JSON.parse(localStorage.getItem('shopez_user'))) } catch { return null } })
  const login = async (data) => { const { data: result } = await authApi.login(data); const account = normalizeUser(result.user); localStorage.setItem('shopez_token', result.token); localStorage.setItem('shopez_user', JSON.stringify(account)); setUser(account); return account }
  const register = (data) => authApi.register(data)
  const logout = () => { localStorage.removeItem('shopez_token'); localStorage.removeItem('shopez_user'); setUser(null) }
  const value = useMemo(() => ({ user, login, register, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
