/**
 * Transforma um nome em "slug": sem acento, minúsculo, com hífens.
 * ATENÇÃO: precisa ser IGUAL à função `slugify` de src/lib/images.ts.
 *
 *   "Homem de Ferro"  -> "homem-de-ferro"
 *   "açai"            -> "acai"
 */
export function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Extensões aceitas */
export const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|svg)$/i;
