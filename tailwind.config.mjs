/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Alentejo-inspired palette: terracotta, olive, warm stone
        terra: {
          50: '#fbf6f2', 100: '#f5e8df', 200: '#e9cbb8',
          500: '#c46a3f', 600: '#a9532e', 700: '#8a4226',
        },
        azul: {
          600: '#2563eb', 700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
