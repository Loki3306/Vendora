// @module customer-frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import { Bell, CheckCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import Loading from '../../components/common/Loading';
import { notificationAPI, getErrorMessage } from '../../services/api';
export default function Notifications() {
  const [items,setItems]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  const load=()=>notificationAPI.list().then(({data})=>setItems(data.data)).catch((e)=>setError(getErrorMessage(e))).finally(()=>setLoading(false));
  useEffect(()=>{load();},[]);
  const markAll=async()=>{await notificationAPI.markAll();setItems((list)=>list.map((item)=>({...item,is_read:true})));};
  const mark=async(item)=>{if(item.is_read)return;await notificationAPI.markRead(item.notification_id);setItems((list)=>list.map((row)=>row.notification_id===item.notification_id?{...row,is_read:true}:row));};
  return <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6"><div className="flex items-center justify-between"><div><h1 className="page-title">Notifications</h1><p className="mt-1 text-sm text-slate-500">Order and marketplace updates in one place.</p></div><button onClick={markAll} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-violet-200 hover:text-violet-700"><CheckCheck className="h-4 w-4"/>Mark all read</button></div>{error&&<p className="mt-4 text-sm text-red-600">{error}</p>}{loading?<Loading/>:<div className="mt-6 space-y-3">{items.length===0?<div className="panel p-10 text-center text-slate-500">No notifications yet.</div>:items.map((item)=><button key={item.notification_id} onClick={()=>mark(item)} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left ${item.is_read?'border-slate-200 bg-white':'border-violet-200 bg-violet-50/60'}`}><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.is_read?'bg-slate-100 text-slate-500':'bg-violet-600 text-white'}`}><Bell className="h-4 w-4"/></span><span className="flex-1"><span className={`block text-sm ${item.is_read?'text-slate-600':'font-semibold text-slate-900'}`}>{item.message}</span><span className="mt-1 block text-xs text-slate-400">{new Date(item.created_at).toLocaleString()}</span></span>{!item.is_read&&<span className="mt-2 h-2 w-2 rounded-full bg-violet-600"/>}</button>)}</div>}</div>;
}
