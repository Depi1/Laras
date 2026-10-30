import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { isDemoMode } from '../demoStore'

function navClass(location, key, value) {
  const params = new URLSearchParams(location.search)
  const active = location.pathname === '/products' && (value ? params.get(key) === value : !params.has('gender') && !params.has('category'))
  return active ? 'active' : undefined
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [demoMode, setDemoMode] = useState(() => isDemoMode())
  useEffect(() => {
    const syncDemoMode = () => setDemoMode(isDemoMode())
    window.addEventListener('laras:demo-mode', syncDemoMode)
    return () => window.removeEventListener('laras:demo-mode', syncDemoMode)
  }, [])
  const leave = () => { logout(); setMenuOpen(false); navigate('/') }
  const closeMenu = () => setMenuOpen(false)
  return <><div className="announcement">{demoMode ? <>Mode demo aktif <span>— data disimpan di browser ini, pembayaran tidak diproses</span></> : <>Gaya yang terasa seperti kamu <span>— pilihan harian, dikurasi dengan cermat</span></>}</div><header className="site-header"><Link className="brand" to="/" onClick={closeMenu}>laras<i>.</i></Link><nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Navigasi utama"><NavLink to="/products" className={navClass(location)} onClick={closeMenu}>Belanja</NavLink><NavLink to="/products?sort=new" className={navClass(location, 'sort', 'new')} onClick={closeMenu}>New arrivals</NavLink><NavLink to="/products?gender=women" className={navClass(location, 'gender', 'women')} onClick={closeMenu}>Women</NavLink><NavLink to="/products?gender=men" className={navClass(location, 'gender', 'men')} onClick={closeMenu}>Men</NavLink></nav><div className="header-actions">{user ? <><Link to={user.usertype === 'admin' ? '/admin' : '/profile'} className="account-link" onClick={closeMenu}>{user.username}</Link><button className="text-button" onClick={leave}>Keluar</button></> : <Link to="/login" className="account-link" onClick={closeMenu}>Masuk</Link>}<Link to="/cart" className="cart-link" onClick={closeMenu}>Tas <span>↗</span></Link><button className="mobile-menu" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? '×' : '☰'}</button></div></header><main><Outlet /></main><footer className="footer"><div><Link className="brand" to="/">laras<i>.</i></Link><p>Gaya sehari-hari, dikurasi dengan cermat.</p></div><div className="footer-links"><Link to="/products">Belanja</Link><Link to="/profile">Pesanan</Link><Link to="/cart">Keranjang</Link></div><small>© {new Date().getFullYear()} Laras. Dibuat untuk keseharianmu.</small></footer></>
}
