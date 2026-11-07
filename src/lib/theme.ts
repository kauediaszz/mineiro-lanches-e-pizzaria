import type { CSSProperties } from "react";
import themeData from "@/data/theme.json";

/**
 * Cores do tema. Os valores vêm de src/data/theme.json (gerado do tema.md).
 * Se alguma cor faltar ou estiver inválida, usamos estes valores neutros
 * (o `npm run validar` avisa quando isso acontece).
 */
export const DEFAULT_COLORS = {
  primary: "#ea580c",
  secondary: "#f59e0b",
  background: "#ffffff",
  foreground: "#1c1917",
};

type ColorName = keyof typeof DEFAULT_COLORS;

/** Converte "#abc" ou "#aabbcc" em [r, g, b]. Devolve null se for inválido. */
export function parseHex(hex: unknown): [number, number, number] | null {
  if (typeof hex !== "string") return null;
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  let value = match[1];
  if (value.length === 3) {
    value = value
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

const toChannels = (rgb: [number, number, number]) => rgb.join(" ");

/** Mistura a cor com branco (0 = cor original, 1 = branco). */
function tint(rgb: [number, number, number], amount: number) {
  return rgb.map((c) => Math.round(c + (255 - c) * amount)) as [
    number,
    number,
    number,
  ];
}

const configured = ((themeData as { colors?: Record<string, unknown> }).colors ??
  {}) as Record<string, unknown>;

function pick(name: ColorName): [number, number, number] {
  return (
    parseHex(configured[name]) ??
    (parseHex(DEFAULT_COLORS[name]) as [number, number, number])
  );
}

const primary = pick("primary");
const secondary = pick("secondary");
const background = pick("background");
const foreground = pick("foreground");

const toHex = (rgb: [number, number, number]) =>
  "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

/** Cor principal em hex (usada na barra do navegador do celular) */
export const themeColorHex = toHex(primary);

/**
 * Variáveis CSS aplicadas no <html> (ver layout.tsx).
 * Formato "R G B" para o Tailwind conseguir aplicar transparência.
 */
export const themeStyle = {
  "--color-primary": toChannels(primary),
  "--color-primary-light": toChannels(tint(primary, 0.45)),
  "--color-secondary": toChannels(secondary),
  "--color-secondary-light": toChannels(tint(secondary, 0.45)),
  "--color-background": toChannels(background),
  "--color-foreground": toChannels(foreground),
} as CSSProperties;
