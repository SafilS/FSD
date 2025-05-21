
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        secondary: "#8b5cf6",
        light: "#f9fafb",
        dark: "#1f2937",
      },
    },
  },
  plugins: [],
}