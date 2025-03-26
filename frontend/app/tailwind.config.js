/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {
      colors: {
        primary_red: '#800000',
        secondary_orange:'#DB6C27',
        secondary_yellow:'#edb021',
        logo_orange_solid:'#e85716',
        logo_orange_light:'#ea8922',
        logo_blue_solid:'#43a1d4',
        logo_blue_light:'#42a6ca'
      },
    },
  },
  plugins: [
    require('preline/plugin'),
    require('@tailwindcss/forms'),
  ],
}

