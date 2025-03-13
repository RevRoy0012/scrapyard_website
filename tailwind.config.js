/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
      colors: {
        scrapyardBlack: '#000000',
        scrapyardRed: '#ff0000',
        scrapyardWhite: '#ffffff',
      },
    },
  },
  plugins: [],
}


