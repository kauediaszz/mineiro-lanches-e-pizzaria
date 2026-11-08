import type { Config } from "tailwindcss";

/**
 * As cores NÃO ficam escritas aqui. Elas vêm de variáveis CSS que o
 * layout.tsx define a partir de src/data/theme.json (gerado do tema.md).
 * O formato "rgb(var(--x) / <alpha-value>)" mantém funcionando as
 * transparências do Tailwind (ex.: border-brand-secondary/20).
 */
const color = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: color("background"),
        foreground: color("foreground"),
        surface: color("surface"),
        accent: color("accent"),
        leaf: color("leaf"),
        brand: {
          primary: color("primary"),
          "primary-light": color("primary-light"),
          secondary: color("secondary"),
          "secondary-light": color("secondary-light"),
        },
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-secondary)) 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgb(var(--color-primary-light)) 0%, rgb(var(--color-secondary-light)) 100%)",
      },
      fontFamily: {
        // A fonte é carregada em src/theme/font.ts (gerado do tema.md)
        sans: ["var(--font-brand)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        brand: "0 10px 30px -10px rgb(var(--color-primary) / 0.4)",
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
