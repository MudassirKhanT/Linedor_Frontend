/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1536",
        "4xl": "1800px",
      },
      fontFamily: {
        serifBrand: ["EB Garamond", "serif"],
        sansBrand: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
