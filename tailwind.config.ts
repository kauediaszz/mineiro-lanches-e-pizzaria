import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta da marca Madrugadao Lanches
        brand: {
          violet: "#7c3aed",
          "violet-light": "#a78bfa",
          pink: "#ec4899",
          "pink-light": "#f9a8d4",
        },
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, #a78bfa 0%, #f9a8d4 100%)",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        brand: "0 10px 30px -10px rgba(124, 58, 237, 0.4)",
      },
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
