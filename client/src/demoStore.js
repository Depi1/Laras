import { demoProducts } from './demoData'

const MODE_KEY = 'laras_demo_mode'
const USERS_KEY = 'laras_demo_users'
const PRODUCTS_KEY = 'laras_demo_products'
const CART_KEY = 'laras_demo_cart'
const ORDERS_KEY = 'laras_demo_orders'
const BANNER_KEY = 'shopez_banner'

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const id = () => globalThis.crypto?.randomUUID?.() || `laras-${Date.now()}-${Math.random().toString(16).slice(2)}`
const user = () => read('shopez_user', null)
const userId = () => user()?.id || user()?.email || 'guest'

export const isDemoMode = () => localStorage.getItem(MODE_KEY) === '1'
export const enableDemoMode = () => {
  localStorage.setItem(MODE_KEY, '1')
  window.dispatchEvent(new Event('laras:demo-mode'))
}
export const demoError = (status, message) => Object.assign(new Error(message), {
  response: { status, data: { message } },
})

async function passwordHash(password) {
  const bytes = new TextEncoder().encode(password)
  const hash = await globalThis.crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(hash)].map((part) => part.toString(16).padStart(2, '0')).join('')
}

export const demoAuth = {
  async register(data) {
    const users = read(USERS_KEY, [])
    const email = data.email.trim().toLowerCase()
    if (users.some((item) => item.email === email)) throw demoError(400, 'Email sudah terdaftar di mode demo.')
    users.push({ id: id(), username: data.username.trim(), email, passwordHash: await passwordHash(data.password), usertype: data.usertype || 'customer' })
    write(USERS_KEY, users)
    return { data: { message: 'Akun demo berhasil dibuat.' } }
  },
  async login(data) {
    const email = data.email.trim().toLowerCase()
    const hash = await passwordHash(data.password)
    const account = read(USERS_KEY, []).find((item) => item.email === email && item.passwordHash === hash)
    if (!account) throw demoError(400, 'Email/password mode demo tidak cocok. Daftar akun demo terlebih dahulu.')
    const publicUser = { ...account }
    delete publicUser.passwordHash
    return { data: { token: `laras-demo-${id()}`, user: publicUser } }
  },
}

export const demoProductsApi = {
  list(params = {}) {
    let products = read(PRODUCTS_KEY, demoProducts)
    const category = String(params.category || '').toLowerCase()
    const gender = String(params.gender || '').toLowerCase()
    const search = String(params.search || '').toLowerCase()
    if (category) products = products.filter((item) => String(item.category || '').toLowerCase() === category)
    if (gender) products = products.filter((item) => String(item.gender || '').toLowerCase() === gender)
    if (search) products = products.filter((item) => `${item.title} ${item.description} ${item.category} ${item.gender}`.toLowerCase().includes(search))
    return { data: products }
  },
  get(productId) {
    const item = read(PRODUCTS_KEY, demoProducts).find((product) => String(product._id || product.id) === String(productId))
    if (!item) throw demoError(404, 'Produk tidak ditemukan.')
    return { data: item }
  },
  create(data) {
    const products = read(PRODUCTS_KEY, demoProducts)
    const product = { ...data, _id: id() }
    write(PRODUCTS_KEY, [product, ...products])
    return { data: product }
  },
  update(productId, data) {
    const products = read(PRODUCTS_KEY, demoProducts)
    const next = products.map((item) => String(item._id || item.id) === String(productId) ? { ...item, ...data, _id: item._id || item.id } : item)
    const updated = next.find((item) => String(item._id || item.id) === String(productId))
    if (!updated) throw demoError(404, 'Produk tidak ditemukan.')
    write(PRODUCTS_KEY, next)
    return { data: updated }
  },
  remove(productId) {
    const products = read(PRODUCTS_KEY, demoProducts)
    write(PRODUCTS_KEY, products.filter((item) => String(item._id || item.id) !== String(productId)))
    return { data: { message: 'Produk dihapus dari data demo.' } }
  },
}

const userCart = () => read(CART_KEY, []).filter((item) => item.userId === userId())
export const demoCartApi = {
  list() { return { data: userCart() } },
  add(data) {
    const cart = read(CART_KEY, [])
    const current = cart.find((item) => item.userId === userId() && item.productId === data.productId && item.size === data.size)
    if (current) current.quantity = Number(current.quantity || 1) + Number(data.quantity || 1)
    else cart.push({ ...data, _id: id(), userId: userId() })
    write(CART_KEY, cart)
    return { data: current || cart.at(-1) }
  },
  remove(cartId) {
    write(CART_KEY, read(CART_KEY, []).filter((item) => !(item.userId === userId() && item._id === cartId)))
    return { data: { message: 'Item dihapus dari keranjang demo.' } }
  },
}

const allDemoOrders = () => read(ORDERS_KEY, [])
export const demoOrderApi = {
  create(data) {
    if (!Array.isArray(data.items) || data.items.length === 0) throw demoError(400, 'Keranjang kosong.')
    const today = new Date()
    const delivery = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const orders = allDemoOrders()
    const created = data.items.map((item) => ({
      ...data,
      ...item,
      _id: id(),
      userId: userId(),
      orderDate: today.toISOString().slice(0, 10),
      deliveryDate: delivery.toISOString().slice(0, 10),
      orderStatus: 'order placed',
    }))
    write(ORDERS_KEY, [...created, ...orders])
    if (data.fromCart) write(CART_KEY, read(CART_KEY, []).filter((item) => item.userId !== userId()))
    return { data: { message: 'Pesanan demo berhasil dibuat.', orders: created } }
  },
  mine() { return { data: allDemoOrders().filter((item) => item.userId === userId()) } },
  cancel(orderId) {
    const orders = allDemoOrders()
    let updated
    const next = orders.map((item) => {
      if (item._id === orderId && item.userId === userId()) updated = { ...item, orderStatus: 'cancelled' }
      return updated && updated._id === item._id ? updated : item
    })
    if (!updated) throw demoError(404, 'Pesanan tidak ditemukan.')
    write(ORDERS_KEY, next)
    return { data: updated }
  },
  all() { return { data: allDemoOrders() } },
  setStatus(orderId, status) {
    const orders = allDemoOrders()
    let updated
    const next = orders.map((item) => {
      if (item._id === orderId) updated = { ...item, orderStatus: status }
      return updated && updated._id === item._id ? updated : item
    })
    if (!updated) throw demoError(404, 'Pesanan tidak ditemukan.')
    write(ORDERS_KEY, next)
    return { data: updated }
  },
}

export const demoAdminApi = {
  stats() { return { data: { users: read(USERS_KEY, []).length, products: read(PRODUCTS_KEY, demoProducts).length, orders: allDemoOrders().length } } },
  banner() { return { data: { banner: localStorage.getItem(BANNER_KEY) || '' } } },
  setBanner(data) { localStorage.setItem(BANNER_KEY, data.banner || ''); return { data: { banner: data.banner || '' } } },
  users() { return { data: read(USERS_KEY, []).map((item) => { const safeUser = { ...item }; delete safeUser.passwordHash; return safeUser }) } },
}
