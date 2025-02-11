/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        display: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#EBF7FE',
          100: '#D7EFFD',
          200: '#AFE0FB',
          300: '#87D0F9',
          400: '#5FC1F7',
          500: '#3FABF3',
          600: '#1E95E5',
          700: '#1576BD',
          800: '#0D5A94',
          900: '#063E6B',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}