/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['var(--font-montserrat)'],
      mono: ['var(--font-sometype_mono)']
    },
    extend: {
      gridTemplateRows: {
        layout: '4rem auto 4rem'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
