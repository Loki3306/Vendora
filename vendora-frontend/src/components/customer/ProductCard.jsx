// @module customer-frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { getErrorMessage } from '../../services/api';

export default function ProductCard({ product }) {
  const { addToCart } = useCart(); const [loading,setLoading]=useState(false); const [message,setMessage]=useState('');
  const add = async () => { setLoading(true); setMessage(''); try { await addToCart(product.product_id,1); } catch (e) { setMessage(getErrorMessage(e,'Could not add to cart.')); } finally { setLoading(false); } };
  return <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-violet-50 via-slate-50 to-amber-50"><span className="grid h-full place-items-center text-7xl transition duration-300 group-hover:scale-105">{product.category_emoji || '🛍️'}</span>{product.stock_qty<=3 && product.stock_qty>0 && <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">Only {product.stock_qty} left</span>}<button disabled={loading || product.stock_qty<=0} onClick={add} className="absolute bottom-0 left-0 right-0 flex translate-y-full items-center justify-center gap-2 bg-slate-900 px-4 py-3 text-sm font-bold text-white transition duration-300 group-hover:translate-y-0 hover:bg-violet-600 disabled:bg-slate-400"><ShoppingCart className="h-4 w-4" />{product.stock_qty<=0?'Out of stock':loading?'Adding…':'Add to Cart'}</button></div>
    <div className="p-4"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">{product.shop_name}</p><h3 className="mt-1.5 min-h-12 text-sm font-bold leading-6 text-slate-900 line-clamp-2">{product.name}</h3><div className="mt-2 flex items-center gap-1 text-xs"><span className="text-amber-400">★★★★★</span><span className="font-semibold text-slate-600">{Number(product.avg_rating||0).toFixed(1)}</span><span className="text-slate-400">({product.review_count})</span></div><div className="mt-3 flex flex-wrap items-center gap-2"><span className="font-mono text-lg font-black text-slate-950">₹{Number(product.price).toLocaleString('en-IN')}</span>{product.original_price && <span className="text-xs text-slate-400 line-through">₹{Number(product.original_price).toLocaleString('en-IN')}</span>}{product.discount_percent>0 && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{product.discount_percent}% off</span>}</div>{message && <p className="mt-2 text-xs text-red-600">{message}</p>}</div>
  </article>;
}
