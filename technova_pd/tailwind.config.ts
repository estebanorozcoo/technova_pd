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
          DEFAULT: "#5B21B6", // morado oscuro principal
          light: "#7C3AED",
          dark: "#3C0D99",
        },
        background: "#0F0A1A", // fondo general oscuro
        white: "#FFFFFF",
      },
    },
  },
  plugins: [],
};

export default config;
