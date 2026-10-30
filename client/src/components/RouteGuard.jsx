import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function RequireAuth({ role }) { const { user } = useAuth(); if (!user) return <Navigate to="/login" replace />; if (role && user.usertype !== role) return <Navigate to={user.usertype === 'admin' ? '/admin' : '/profile'} replace />; return <Outlet /> }
