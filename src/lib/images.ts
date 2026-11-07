import manifestData from "@/data/images.manifest.json";

/**
 * Mapa das imagens otimizadas. É GERADO por `npm run images`
 * (scripts/optimize-images.mjs) a partir de conteudo/imagens/.
 */
export interface ImageManifest {
  /** Caminho do logo (ex: "/brand/logo.webp") ou null quando a loja não tem logo */
  logo: string | null;
  /** "nome-do-arquivo-sem-extensao" -> caminho final em /public */
  images: Record<string, string>;
}

const manifest = manifestData as unknown as ImageManifest;

/**
 * Transforma um nome em "slug": sem acento, minúsculo, com hífens.
 * ATENÇÃO: precisa ser IGUAL à função de scripts/lib/slug.mjs.
 */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Recebe o nome do arquivo como está escrito no cardápio
 * ("Homem de Ferro.JPG", "homem-de-ferro", ...) e devolve o caminho da imagem
 * otimizada. Se a foto não existir, devolve "" (o site mostra o placeholder).
 */
export function resolveImage(reference?: string): string {
  if (!reference) return "";
  const base = reference
    .trim()
    .replace(/^.*[\\/]/, "")
    .replace(/\.(jpe?g|png|webp|gif|avif|svg)$/i, "");
  return manifest.images[slugify(base)] ?? "";
}

/** Caminho do logo da loja, ou null se ela não tiver logo */
export const logoPath: string | null = manifest.logo ?? null;
