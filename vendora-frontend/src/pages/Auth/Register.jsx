// @module auth-frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, getErrorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'customer', shop_name:'', description:'' });
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const { login } = useAuth(); const navigate = useNavigate();
  const strength = useMemo(() => {
    let score = 0; const value=form.password;
    if (value.length >= 8) score++; if (/[A-Z]/.test(value)) score++; if (/\d/.test(value)) score++; if (/[^A-Za-z0-9]/.test(value)) score++;
    return score;
  }, [form.password]);
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); setLoading(false); return; }
    try {
      const { data } = await authAPI.register(form);
      login(data.data.token, data.data.user, true);
      navigate(form.role === 'vendor' ? '/vendor' : '/customer', { replace: true });
    } catch (err) { setError(getErrorMessage(err, 'Registration failed.')); } finally { setLoading(false); }
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <h1 className="text-3xl font-black">Create your Vendora account</h1><p className="mt-2 text-sm text-slate-400">Choose how you want to use the marketplace.</p>
        <div className="mt-6 grid grid-cols-2 rounded-xl bg-black/20 p-1">{['customer','vendor'].map((role) => <button type="button" key={role} onClick={() => setForm({ ...form, role })} className={`rounded-lg px-3 py-2 text-sm font-bold capitalize ${form.role===role?'bg-violet-600 text-white':'text-slate-400 hover:text-white'}`}>{role}</button>)}</div>
        {error && <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-1 block text-xs text-slate-300">Full name</span><input className="glass-input" value={form.name} onChange={update('name')} required /></label><label><span className="mb-1 block text-xs text-slate-300">Email</span><input className="glass-input" type="email" value={form.email} onChange={update('email')} required /></label></div>
          <label className="block"><span className="mb-1 block text-xs text-slate-300">Password</span><input className="glass-input" type="password" value={form.password} onChange={update('password')} required /><div className="mt-2 grid grid-cols-4 gap-1">{[1,2,3,4].map((n)=><span key={n} className={`h-1.5 rounded-full ${strength>=n?'bg-violet-400':'bg-white/10'}`} />)}</div></label>
          {form.role === 'vendor' && <div className="space-y-4 rounded-2xl border border-violet-400/15 bg-violet-500/5 p-4"><label className="block"><span className="mb-1 block text-xs text-slate-300">Shop name</span><input className="glass-input" value={form.shop_name} onChange={update('shop_name')} required /></label><label className="block"><span className="mb-1 block text-xs text-slate-300">Shop description</span><textarea className="glass-input min-h-24" value={form.description} onChange={update('description')} /></label><p className="text-xs text-amber-300">New vendor accounts remain pending until approved by an administrator.</p></div>}
          <button disabled={loading} className="w-full rounded-xl bg-violet-600 px-4 py-3 font-bold hover:bg-violet-500 disabled:opacity-60">{loading?'Creating account…':'Create Account'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">Already registered? <Link to="/login" className="font-semibold text-violet-300">Sign in</Link></p>
      </div>
    </main>
  );
}
