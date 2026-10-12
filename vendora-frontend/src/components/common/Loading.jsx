// @module frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
export default function Loading({ label = 'Loading Vendora…' }) {
  return <div className="flex min-h-48 items-center justify-center gap-3 text-sm font-medium text-slate-500"><span className="h-5 w-5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />{label}</div>;
}
