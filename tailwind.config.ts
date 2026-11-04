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
        // Paleta da marca Madrugadão Lanches
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
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "sheet-up": {
          "0%": { transform: "translateY(48px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        // A foto "vem pra frente": nasce pequena, passa do tamanho e assenta
        "zoom-forward": {
          "0%": {
            transform: "scale(0.55) translateY(28px) rotate(-5deg)",
            opacity: "0",
          },
          "60%": {
            transform: "scale(1.1) translateY(-4px) rotate(1deg)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(1) translateY(0) rotate(0deg)",
            opacity: "1",
          },
        },
      },
      animation: {
        "pop-in": "pop-in 0.25s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "sheet-up": "sheet-up 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        "zoom-forward": "zoom-forward 0.55s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
