/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../../../templates/map/*.html"],
  safelist: ['list-disc'],
  theme: {
    fontSize: {
      xs: ['12px', '18px'],
      sm: ['14px', '20px'],
      base: ['16px', '24px'],
      lg: ['20px', '28px'],
      xl: ['24px', '32px'],
      "2xl": ['26px', '34px'],
      "3xl": ['32px', '36px'],
      "4xl": ['36px', '40px']
    },
    extend: {},
  },
  plugins: [],
}

