/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#1e3a8a',
        success: '#16a34a',
        error: '#dc2626',
        background: '#f1f5f9',
        surface: '#ffffff',
        text: '#0f172a',
      },
      boxShadow: {
        soft: '0 10px 25px -12px rgba(2, 6, 23, 0.15)',
      },
    },
  },
  plugins: [],
}
