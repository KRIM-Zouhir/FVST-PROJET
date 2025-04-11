/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
          950: '#0a0a0a',
        },
        accent: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#292929',
          800: '#171717',
          900: '#0a0a0a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['UberMove', 'Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
      boxShadow: {
        'elegant': '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        'elegant-lg': '0 1px 3px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'elegant-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        'luxe': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      textShadow: {
        'elegant': '0 2px 5px rgba(0, 0, 0, 0.1)',
        'elegant-lg': '0 2px 10px rgba(0, 0, 0, 0.2)',
      },
      letterSpacing: {
        'elegant': '-0.03em',
        tighter: '-0.04em',
      },
      transitionDuration: {
        '400': '400ms',
        '2000': '2000ms',
      },
      backgroundImage: {
        'gradient-elegant': 'linear-gradient(to right, rgba(0, 0, 0, 0.025), rgba(0, 0, 0, 0.05))',
      },
      fontSize: {
        '5xl': ['52px', '1.1'],
        '4xl': ['36px', '1.2'],
        '3xl': ['24px', '1.3'],
        '2xl': ['20px', '1.4'],
        'xl': ['18px', '1.5'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-elegant': {
          textShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-elegant-lg': {
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
};