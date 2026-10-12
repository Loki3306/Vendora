// @module auth-frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import { LockKeyhole, Mail, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI, getErrorMessage } from '../../services/api';

const demos = [
  ['Customer','rahul.m@gmail.com','password123'],
  ['Vendor','arjun.k@gmail.com','password123'],
  ['Admin','admin@vendora.com','admin123'],
];
const destination = (role) => role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor' : '/customer';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const authenticate = async (email, password) => {
    setLoading(true); setError('');
    try {
      const { data } = await authAPI.login({ email, password });
      login(data.data.token, data.data.user, form.remember);
      navigate(destination(data.data.user.role), { replace: true });
    } catch (err) { setError(getErrorMessage(err, 'Unable to sign in.')); }
    finally { setLoading(false); }
  };

  const submit = (event) => { event.preventDefault(); authenticate(form.email, form.password); };
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="mb-8 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-900/30"><ShoppingBag /></span><h1 className="mt-4 text-3xl font-black">Welcome to Vendora</h1><p className="mt-2 text-sm text-slate-400">Sign in to your marketplace workspace.</p></div>
          {error && <div className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-300">Email</span><div className="relative"><Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input className="glass-input pl-10" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" /></div></label>
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-300">Password</span><div className="relative"><LockKeyhole className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input className="glass-input pl-10" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" /></div></label>
            <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} className="rounded border-white/20 bg-white/10 text-violet-500" />Remember me</label>
            <button disabled={loading} className="w-full rounded-xl bg-violet-600 px-4 py-3 font-bold text-white hover:bg-violet-500 disabled:opacity-60">{loading ? 'Signing in…' : 'Sign In'}</button>
          </form>
          <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[.2em] text-slate-500"><span className="h-px flex-1 bg-white/10" />Demo access<span className="h-px flex-1 bg-white/10" /></div>
          <div className="grid grid-cols-3 gap-2">{demos.map(([label,email,password]) => <button key={label} disabled={loading} onClick={() => authenticate(email,password)} className="rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-xs font-semibold text-slate-200 hover:border-violet-400/40 hover:bg-violet-500/10">{label}</button>)}</div>
          <p className="mt-7 text-center text-sm text-slate-400">New to Vendora? <Link to="/register" className="font-semibold text-violet-300 hover:text-violet-200">Create account</Link></p>
        </div>
      </div>
    </main>
  );
}
