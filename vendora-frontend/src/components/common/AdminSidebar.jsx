// @module admin-frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import { BarChart3, Boxes, FolderKanban, LayoutDashboard, LogOut, Settings, Store, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const itemClass = ({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`;
export default function AdminSidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-slate-950 p-4 text-white">
      <div className="mb-8 flex items-center gap-2 px-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500 font-black text-slate-950">V</span><span className="text-xl font-black">Vendora</span></div>
      <p className="mb-2 px-3 text-[10px] font-bold tracking-[.18em] text-slate-500">OVERVIEW</p>
      <NavLink end to="/admin" className={itemClass}><LayoutDashboard className="h-4 w-4" />Platform Overview</NavLink>
      <p className="mb-2 mt-6 px-3 text-[10px] font-bold tracking-[.18em] text-slate-500">MANAGEMENT</p>
      <nav className="space-y-1">
        <NavLink to="/admin/users" className={itemClass}><Users className="h-4 w-4" />Users</NavLink>
        <NavLink to="/admin/vendors" className={itemClass}><Store className="h-4 w-4" />Vendors</NavLink>
        <NavLink to="/admin/products" className={itemClass}><Boxes className="h-4 w-4" />Products</NavLink>
        <NavLink to="/admin/categories" className={itemClass}><FolderKanban className="h-4 w-4" />Categories</NavLink>
      </nav>
      <p className="mb-2 mt-6 px-3 text-[10px] font-bold tracking-[.18em] text-slate-500">REPORTS</p>
      <NavLink to="/admin/reports" className={itemClass}><BarChart3 className="h-4 w-4" />Sales Reports</NavLink>
      <p className="mb-2 mt-6 px-3 text-[10px] font-bold tracking-[.18em] text-slate-500">ACCOUNT</p>
      <button disabled className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500"><Settings className="h-4 w-4" />Settings</button>
      <button onClick={logout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800"><LogOut className="h-4 w-4" />Logout</button>
      <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900 p-3"><p className="truncate text-sm font-semibold">{user?.name || 'Admin User'}</p><span className="mt-1 inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">Super Admin</span></div>
    </aside>
  );
}
