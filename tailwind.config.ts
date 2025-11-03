import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          // 50: '#f0fdf4',
          // 100: '#dcfce7',
          // 200: '#bbf7d0',
          // 300: '#86efac',
          // 400: '#4ade80',
          // 500: '#22c55e',
          // 600: '#16a34a',
          // 700: '#15803d',
          // 800: '#166534',
          // 900: '#14532d',
            50:  '#f2f7ff',
            100: '#dce9ff',
            200: '#b8d2ff',
            300: '#8ab3ff',
            400: '#558cff',
            500: '#2c6bff',   // azul moderno
            600: '#1e4fb8',   // azul profesional
            700: '#173f94',
            800: '#112f70',   // azul marino
            900: '#0c2152',
        },
      },
    },
  },
  plugins: [],
};
export default config;
