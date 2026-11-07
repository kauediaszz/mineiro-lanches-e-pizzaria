import { storeConfig } from "@/data/config";
import { logoPath } from "@/lib/images";

/** Caminho do logo da loja, ou null se não tiver (aí o site usa a inicial do nome) */
export const brandLogo: string | null = logoPath;

/** Primeira letra do nome da loja, usada como marca quando não há logo */
export const brandInitial: string =
  storeConfig.name.trim().charAt(0).toUpperCase() || "•";

/**
 * Divide o nome em duas linhas para o topo do site:
 * "Pizzaria do Zé" -> ["Pizzaria", "do Zé"]
 * "Pizzaria" -> ["Pizzaria", ""]
 */
export function splitStoreName(name: string): [string, string] {
  const words = name.trim().split(/\s+/);
  return [words[0] ?? "", words.slice(1).join(" ")];
}
