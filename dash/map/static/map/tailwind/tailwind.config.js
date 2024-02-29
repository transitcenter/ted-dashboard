/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../../../templates/map/*.html"],
  safelist: ['list-disc'],
  theme: {
    fontSize: {
      sm: ['14px', '22px'],
      base: ['16px', '24px'],
      lg: ['20px', '28px'],
      xl: ['24px', '32px'],
      "2xl": ['28px', '34px'],
      "3xl": ['30px', '36px'],
      "4xl": ['36px', '40px']
    },
    extend: {},
  },
  plugins: [],
}

