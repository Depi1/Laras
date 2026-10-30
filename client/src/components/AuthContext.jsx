import { createContext, useContext, useMemo, useState } from 'react'
import { authApi } from '../api'

const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('shopez_user')) } catch { return null } })
  const login = async (data) => { const { data: result } = await authApi.login(data); localStorage.setItem('shopez_token', result.token); localStorage.setItem('shopez_user', JSON.stringify(result.user)); setUser(result.user); return result.user }
  const register = (data) => authApi.register(data)
  const logout = () => { localStorage.removeItem('shopez_token'); localStorage.removeItem('shopez_user'); setUser(null) }
  const value = useMemo(() => ({ user, login, register, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
