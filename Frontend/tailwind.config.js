/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black-primary': '#0a0a0a',
        'black-secondary': '#121212',
        'grey-darkest': '#1a1a1a',
        'grey-darker': '#1f1f1f',
        'grey-dark': '#2a2a2a',
        'grey-medium': '#333333',
        'grey-light': '#a0a0a0',
        'grey-lighter': '#888888',
        'text-primary': '#e5e5e5',
        'text-secondary': '#f5f5f5',
        'text-muted': '#a0a0a0',
        'hover': '#252525',
        'accent': '#ffffff',
      },
    },
  },
  plugins: [],
}
