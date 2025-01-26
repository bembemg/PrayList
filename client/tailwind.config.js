/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
        950: '#082f49',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      }
    },
    keyframes: {
      slideDown: {
        '0%': { transform: 'translateY(-10px)', opacity: 0 },
        '10%': { transform: 'translateY(0)', opacity: 1 },
        '90%': { transform: 'translateY(0)', opacity: 1 },
        '100%': { transform: 'translateY(-10px)', opacity: -1 },
      },
      contentSlideDown: {
        '0%': { transform: 'translateY(-70px)' },
        '10%': { transform: 'translateY(10px)', },
        '90%': { transform: 'translateY(10px)', },
        '100%': { transform: 'translateY(-70px)' },
      },
      openDialog: {
        '0%': { transform: 'scale(0) translate(-50%, -50%)', opacity: 0, top: '50%', left: '50%', },
        '50%': { transform: 'scale(1.2) translate(-50%, -50%)', opacity: 1, top: '50%', left: '50%' },
        '100%': { transform: 'scale(1) translate(-50%, -50%)', opacity: 1, top: '50%', left: '50%' },
      },
      closeDialog: {
        '0%': { transform: 'scale(1) translate(-50%, -50%)', opacity: 1, top: '50%', left: '50%', },
        '50%': { transform: 'scale(1.2) translate(-50%, -50%)', opacity: 1, top: '50%', left: '50%' },
        '100%': { transform: 'scale(0) translate(-50%, -50%)', opacity: 0, top: '50%', left: '50%' }
      },
    },
    animation: {
      slideDown: 'slideDown 5s ease-in-out forwards',
      contentSlideDown: 'contentSlideDown 5s ease-in-out forwards',
      openDialog: 'openDialog .5s ease-in-out forwards',
      closeDialog: 'closeDialog .5s ease-in-out forwards',
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

