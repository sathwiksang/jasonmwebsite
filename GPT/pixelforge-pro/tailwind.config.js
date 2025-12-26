/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        editor: {
          bg: {
            dark: '#1a1a1a',
            light: '#f5f5f5',
          },
          panel: {
            dark: '#2a2a2a',
            light: '#ffffff',
          },
          border: {
            dark: '#3a3a3a',
            light: '#e0e0e0',
          },
          text: {
            primary: {
              dark: '#ffffff',
              light: '#1a1a1a',
            },
            secondary: {
              dark: '#a0a0a0',
              light: '#666666',
            },
          },
          accent: {
            primary: '#3b82f6',
            hover: '#2563eb',
          },
        },
      },
      animation: {
        'marching-ants': 'marching-ants 0.5s linear infinite',
      },
      keyframes: {
        'marching-ants': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '8' },
        },
      },
    },
  },
  plugins: [],
}
