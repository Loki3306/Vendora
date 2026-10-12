// @module vendor-frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
export default function RevenueChart({ data = [] }) {
  return <div className="panel p-5"><div className="mb-5"><h3 className="font-bold text-slate-900">Revenue trend</h3><p className="text-xs text-slate-500">Delivered-order revenue by month</p></div><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid vertical={false} strokeDasharray="3 3"/><XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12}/><YAxis axisLine={false} tickLine={false} fontSize={12}/><Tooltip contentStyle={{background:'#0f172a',border:'none',borderRadius:'12px',color:'#fff'}} formatter={(v)=>[`₹${Number(v).toLocaleString('en-IN')}`,'Revenue']}/><Bar dataKey="revenue" fill="#7C3AED" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div></div>;
}
