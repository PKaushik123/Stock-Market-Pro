/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#38bdf8',
        accent: '#22c55e',
        navy: '#09111f',
        panel: '#0f172a',
      },
      boxShadow: {
        glow: '0 0 20px rgba(56, 189, 248, 0.25)',
      },
    },
  },
  plugins: [],
};

