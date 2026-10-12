// @module frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary><AuthProvider><CartProvider><App /></CartProvider></AuthProvider></ErrorBoundary>
  </React.StrictMode>,
);
