/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'from-orange-400',
    'to-pink-500',
    'from-blue-400', 
    'to-purple-500',
    'from-red-500',
    'to-orange-500',
    'from-purple-500',
    'to-indigo-600',
    'from-green-400',
    'to-blue-500',
    'from-gray-400',
    'to-gray-600',
    'bg-gradient-to-br'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}