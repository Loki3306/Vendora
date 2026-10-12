// @module config | Vendora v1.0 | SPIT Mini Project AY 2026-27
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vendora: {
          primary: '#7C3AED',
          'primary-dark': '#5B21B6',
          'primary-light': '#8B5CF6',
          accent: '#F59E0B',
          base: '#0F172A',
          muted: '#64748B',
          surface: '#F8FAFC',
        },
      },
      boxShadow: {
        'vendora-card': '0 10px 30px -12px rgba(15, 23, 42, 0.18)',
      },
    },
  },
  plugins: [forms],
};
