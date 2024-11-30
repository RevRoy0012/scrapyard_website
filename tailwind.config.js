/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scrapyardBlack: '#000000',
        scrapyardRed: '#ff0000',
        scrapyardWhite: '#ffffff',
      },
    },
  },
  plugins: [],
}

