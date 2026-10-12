// @module customer-frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import { Bell, Search, ShoppingCart, LogOut, Package, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { notificationAPI } from '../../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, openCart } = useCart();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    notificationAPI.list().then(({ data }) => setUnread((data.data || []).filter((item) => !item.is_read).length)).catch(() => setUnread(0));
  }, []);

  const submit = (event) => {
    event.preventDefault();
    navigate(`/customer?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/customer" className="flex shrink-0 items-center gap-2 font-black tracking-tight text-slate-950">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-lg text-white shadow-lg shadow-violet-200">V</span>
          <span className="hidden text-xl sm:inline">Vendora</span>
        </Link>
        <form onSubmit={submit} className="mx-auto flex min-w-0 max-w-2xl flex-1 items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 focus-within:border-violet-300 focus-within:bg-white">
          <Search className="mr-2 h-4 w-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products or vendors" className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm focus:ring-0" />
          <span className="hidden rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-400 md:inline">⌘K</span>
        </form>
        <button onClick={openCart} className="relative rounded-xl p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700" aria-label="Open cart">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-violet-600 px-1 text-center text-[10px] font-bold leading-5 text-white">{cartCount}</span>}
        </button>
        <Link to="/customer/notifications" className="relative rounded-xl p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unread > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-amber-500 px-1 text-center text-[10px] font-bold leading-5 text-white">{unread}</span>}
        </Link>
        <div className="relative">
          <button onClick={() => setMenuOpen((value) => !value)} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-2 hover:border-violet-200">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="border-b border-slate-100 px-3 py-2"><p className="text-sm font-semibold text-slate-900">{user?.name}</p><p className="truncate text-xs text-slate-500">{user?.email}</p></div>
              <Link onClick={() => setMenuOpen(false)} to="/customer/orders" className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"><Package className="h-4 w-4" />My Orders</Link>
              <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" />Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
