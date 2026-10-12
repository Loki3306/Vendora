// @module vendor-frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import { BarChart3, Boxes, LayoutDashboard, LogOut, PackageCheck, Settings, Bell } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const itemClass = ({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`;

export default function VendorSidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-slate-900 p-4 text-white">
      <div className="mb-8 flex items-center gap-2 px-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 font-black">V</span><span className="text-xl font-black">Vendora</span></div>
      <p className="mb-2 px-3 text-[10px] font-bold tracking-[.18em] text-slate-500">WORKSPACE</p>
      <nav className="space-y-1">
        <NavLink end to="/vendor" className={itemClass}><LayoutDashboard className="h-4 w-4" />Dashboard</NavLink>
        <NavLink to="/vendor/products" className={itemClass}><Boxes className="h-4 w-4" />My Products</NavLink>
        <NavLink to="/vendor/orders" className={itemClass}><PackageCheck className="h-4 w-4" />Orders</NavLink>
        <NavLink to="/vendor/analytics" className={itemClass}><BarChart3 className="h-4 w-4" />Analytics</NavLink>
      </nav>
      <p className="mb-2 mt-7 px-3 text-[10px] font-bold tracking-[.18em] text-slate-500">ACCOUNT</p>
      <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500" disabled><Bell className="h-4 w-4" />Notifications<span className="ml-auto rounded-full bg-amber-500/20 px-2 text-[10px] text-amber-300">orders</span></button>
      <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500" disabled><Settings className="h-4 w-4" />Settings</button>
      <button onClick={logout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"><LogOut className="h-4 w-4" />Logout</button>
      <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
        <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-violet-600 font-bold">{user?.name?.[0] || 'V'}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{user?.shop_name || user?.name}</p><p className="text-[11px] text-emerald-400">Verified Vendor</p></div></div>
      </div>
    </aside>
  );
}
