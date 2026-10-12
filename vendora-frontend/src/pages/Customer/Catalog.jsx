// @module customer-frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryStrip from '../../components/customer/CategoryStrip';
import FilterSidebar from '../../components/customer/FilterSidebar';
import ProductCard from '../../components/customer/ProductCard';
import CartDrawer from '../../components/customer/CartDrawer';
import Loading from '../../components/common/Loading';
import { useCart } from '../../context/CartContext';
import { productAPI, getErrorMessage } from '../../services/api';

export default function Catalog() {
  const [params,setParams]=useSearchParams();
  const [filters,setFilters]=useState({min_price:'',max_price:'',category_id:'',in_stock:'',vendor_id:'',min_rating:''});
  const [products,setProducts]=useState([]); const [categories,setCategories]=useState([]); const [vendors,setVendors]=useState([]);
  const [pagination,setPagination]=useState({page:1,totalPages:1,total:0}); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  const {isCartOpen,closeCart}=useCart();
  const search=params.get('search')||'';
  const load = useCallback(async (page=1) => { setLoading(true); setError(''); try { const {data}=await productAPI.list({ ...filters, search:search||undefined, page, limit:12, sort:'newest' }); setProducts(data.data); setPagination(data.pagination); } catch(e){setError(getErrorMessage(e));} finally{setLoading(false);} },[filters,search]);
  useEffect(()=>{ Promise.all([productAPI.categories(),productAPI.vendors()]).then(([c,v])=>{setCategories(c.data.data);setVendors(v.data.data);}).catch(()=>{}); },[]);
  useEffect(()=>{load(1);},[load]);
  const onCategory=(id)=>setFilters((f)=>({...f,category_id:id}));
  return <><div className="mx-auto max-w-[1600px] px-4 pb-10 sm:px-6 lg:px-8"><CategoryStrip selectedCategory={filters.category_id} onSelect={onCategory} categories={categories}/><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h1 className="page-title">Discover products</h1><p className="mt-1 text-sm text-slate-500">{search?`Results for “${search}”`:'Curated products from verified Vendora sellers.'}</p></div>{search&&<button onClick={()=>setParams({})} className="text-sm font-semibold text-violet-600">Clear search</button>}</div><div className="grid gap-6 lg:grid-cols-[250px_1fr]"><FilterSidebar filters={filters} onFilterChange={setFilters} categories={categories} vendors={vendors}/><main>{error&&<div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}{loading?<Loading label="Loading products…"/>:<>{products.length?<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{products.map((product)=><ProductCard key={product.product_id} product={product}/>)}</div>:<div className="panel p-10 text-center text-slate-500">No products match the current filters.</div>}<div className="mt-8 flex items-center justify-between"><span className="text-sm text-slate-500">{pagination.total||0} products</span><div className="flex gap-2"><button disabled={pagination.page<=1} onClick={()=>load(pagination.page-1)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40">Previous</button><span className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">{pagination.page||1} / {Math.max(1,pagination.totalPages||1)}</span><button disabled={pagination.page>=pagination.totalPages} onClick={()=>load(pagination.page+1)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40">Next</button></div></div></>}</main></div></div><CartDrawer isOpen={isCartOpen} onClose={closeCart}/></>;
}
