/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F8FA',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#EFF6FF',
        },
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
        text: '#111827',
        muted: '#6B7280',
        border: '#E5E7EB',
      }
    },
  },
  plugins: [],
}
