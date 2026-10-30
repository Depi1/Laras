import { Link } from 'react-router-dom'

export const money = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value) || 0)
export const productId = (item) => item?._id || item?.id
export function Notice({ children, type = 'info' }) { return children ? <div className={`notice ${type}`}>{children}</div> : null }
export function ProductCard({ product, onAdd }) {
  const price = Number(product.price || 0)
  const sale = Math.round(price * (1 - (Number(product.discount || 0) / 100)))
  return <article className="product-card">
    <Link to={`/products/${productId(product)}`} className="product-image">{product.mainImg ? <img src={product.mainImg} alt={product.title} /> : <span>LARAS</span>}{Number(product.discount) > 0 && <b className="discount">-{product.discount}%</b>}</Link>
    <div className="product-info"><small>{product.category || 'Pilihan Laras'}</small><Link className="product-title" to={`/products/${productId(product)}`}>{product.title}</Link><div className="price-line"><strong>{money(sale)}</strong>{sale !== price && <del>{money(price)}</del>}</div>{onAdd ? <button className="button button-dark button-small" onClick={() => onAdd(product)}>Tambah ke keranjang</button> : <Link className="button button-dark button-small" to={`/products/${productId(product)}`}>Lihat detail ↗</Link>}</div>
  </article>
}
export function PageTitle({ eyebrow, children, description }) { return <div className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{children}</h1>{description && <p>{description}</p>}</div> }
