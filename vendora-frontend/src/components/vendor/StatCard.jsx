// @module vendor-frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
export default function StatCard({ label, value, trend, trendPositive = true, icon: Icon, variant = 'default' }) {
  const featured = variant === 'featured';
  return <div className={`rounded-2xl border p-5 ${featured ? 'border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200' : 'border-slate-200 bg-white text-slate-900 shadow-sm'}`}>
    <div className="flex items-start justify-between gap-3"><div><p className={`text-xs font-bold uppercase tracking-wider ${featured?'text-slate-400':'text-slate-500'}`}>{label}</p><p className={`mt-2 font-mono text-3xl font-black ${featured?'text-white':'text-slate-950'}`}>{value}</p></div>{Icon&&<span className={`grid h-10 w-10 place-items-center rounded-xl ${featured?'bg-white/10 text-violet-300':'bg-violet-50 text-violet-600'}`}><Icon className="h-5 w-5"/></span>}</div>{trend&&<p className={`mt-3 text-xs font-semibold ${trendPositive?'text-emerald-500':'text-red-500'}`}>{trend}</p>}</div>;
}
