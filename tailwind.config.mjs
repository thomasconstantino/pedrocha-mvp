/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // LUMO Properties brand palette (Manual de Normas)
        // Channel Marker Green #004238 · Pale Lime #DBF090 · Floral White #FFFAF3 · Dark Teal #001C18
        lumo: {
          50: '#e9f1ee',
          100: '#d0e2db',
          200: '#a6c8bd',
          300: '#6fa595',
          500: '#1d7a64',
          600: '#0a5a48',
          700: '#004238', // Channel Marker Green — primary
          800: '#002e27',
          900: '#001c18', // Dark Teal Green — ink
        },
        lime: {
          100: '#f4fadd',
          200: '#e6f4b6',
          300: '#dbf090', // Pale Lime — accent
          400: '#cbe86a',
        },
        cream: '#fffaf3', // Floral White — background
        ink: '#001c18',
        // --- aliases: rebrand existing markup to the LUMO palette ---
        terra: {
          50: '#eef5ef',
          100: '#d6e6df',
          200: '#b9d3c8',
          500: '#1d7a64',
          600: '#0a5a48',
          700: '#004238',
        },
        azul: { 600: '#0a5a48', 700: '#004238' },
        green: {
          50: '#f3fadf',
          100: '#e6f4b6',
          200: '#dbf090',
          500: '#1d7a64',
          700: '#004238',
          800: '#002e27',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
