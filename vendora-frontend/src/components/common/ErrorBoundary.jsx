// @module frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div className="grid min-h-[60vh] place-items-center p-8">
        <div className="max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-vendora-card">
          <h2 className="text-xl font-bold text-slate-900">This view could not be rendered.</h2>
          <p className="mt-2 text-sm text-slate-500">Reload the page. If the issue persists, verify that the backend and database are running.</p>
          <button onClick={() => window.location.reload()} className="mt-5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">Reload</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}
