/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#121212',
        'secondary-bg': '#1e1e1e',
        'accent': '#FEDA3C',
        'accent-50': 'rgba(254, 218, 60, 0.5)',
        'accent-30': 'rgba(254, 218, 60, 0.3)',
        'text-primary': '#FFFFFF',
        'text-secondary': '#AAAAAA',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(254, 218, 60, 0.3)',
        'glow-strong': '0 0 20px rgba(254, 218, 60, 0.5)',
      },
      fontFamily: {
        'sans': ['Roboto', 'ui-sans-serif', 'system-ui'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'continuous-scroll': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'continuous-scroll': 'continuous-scroll 30s linear infinite',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#1e1e1e',
            borderRadius: '100px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#333333',
            borderRadius: '100px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#FEDA3C',
          },
          'scrollbarWidth': 'thin',
          'scrollbarColor': '#333333 #1e1e1e',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
