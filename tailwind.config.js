/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Install Custom Font
      fontFamily: {
        inter: ["Inter"]
      }
      
    },
  },
  plugins: [],
}

