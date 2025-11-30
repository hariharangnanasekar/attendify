/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#1D4ED8',
          teal: '#14B8A6',
        },
        status: {
          present: '#22C55E',
          absent: '#EF4444',
          late: '#FACC15',
          halfDay: '#F97316',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Lato', 'system-ui', 'sans-serif'],
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
}

