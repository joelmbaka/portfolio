import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Joel's Beach Sunset Brand Colors
        'ocean-blue': {
          DEFAULT: 'var(--ocean-blue)',
          dark: 'var(--ocean-blue-dark)',
        },
        'palm-green': {
          DEFAULT: 'var(--palm-green)',
          dark: 'var(--palm-green-dark)',
        },
        'sunset-yellow': {
          DEFAULT: 'var(--sunset-yellow)',
          dark: 'var(--sunset-yellow-dark)',
        },
        'sandy-beach': {
          DEFAULT: 'var(--sandy-beach)',
          overlay: 'var(--sandy-beach-overlay)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
