/**
 * CARDÁPIO (carregador)
 * ---------------------------------------------------------------
 * ESTE ARQUIVO NÃO MUDA de loja para loja.
 * O conteúdo vem de src/data/menu.json, que é GERADO a partir do
 * conteudo/cardapio.md (veja o AGENTS.md). Aqui só transformamos o JSON
 * simples nos objetos que o site usa e conferimos se está tudo coerente.
 * Se algo estiver errado, o build falha com uma mensagem clara.
 */
import menuData from "./menu.json";
import { resolveImage, slugify } from "@/lib/images";

/* ------------------------------------------------------------------ */
/* Tipos usados pelo site                                              */
/* ------------------------------------------------------------------ */

export type Category = string;

export interface CategoryDef {
  id: Category;
  label: string;
  emoji: string;
}

export interface Variant {
  id: string;
  label: string; // vazio quando o produto só tem um preço
  price: number; // em reais
}

export interface Addon {
  id: string;
  label: string;
  price: number;
}

export interface OptionGroup {
  id: string;
  title: string;
  type: "single" | "multiple";
  required?: boolean; // single: precisa escolher 1 / multiple: pelo menos 1
  max?: number; // só pra "multiple": limite de escolhas
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string; // caminho da imagem otimizada ou "" pra placeholder
  emoji?: string;
  category: Category;
  section?: string;
  variants: Variant[];
  optionGroups?: OptionGroup[];
  addons?: Addon[];
  /** Permite meio a meio a partir deste tamanho (índice em variants) */
  halfHalfFrom?: number;
}

/* ------------------------------------------------------------------ */
/* Formato do menu.json                                                */
/* ------------------------------------------------------------------ */

interface RawAddon {
  id?: string;
  label: string;
  price: number;
}

interface RawOptionGroup {
  id?: string;
  title: string;
  type: "single" | "multiple";
  required?: boolean;
  max?: number;
  options: string[];
}

interface RawProduct {
  id: string;
  name: string;
  description?: string;
  category: string;
  section?: string;
  /** Nome do arquivo da foto como está no cardápio (ex: "homem de ferro.jpg") */
  image?: string;
  emoji?: string;
  /** Produto com um preço só */
  price?: number;
  /** Produto com tamanhos/versões */
  variants?: { label?: string; price: number }[];
  /** Nome de um conjunto em "optionSets" ou o grupo escrito direto */
  optionGroups?: (string | RawOptionGroup)[];
  /** Nome de um conjunto em "addonSets" ou a lista escrita direto */
  addons?: string | RawAddon[];
}

interface RawMenu {
  categories: {
    id: string;
    label: string;
    emoji?: string;
    /** Rótulo do menor tamanho que aceita meio a meio (ex: "G (40 cm)") */
    halfHalfFrom?: string;
  }[];
  addonSets?: Record<string, RawAddon[]>;
  optionSets?: Record<string, RawOptionGroup>;
  products: RawProduct[];
  featured?: { product: string; tagline?: string; image?: string };
}

const raw = menuData as unknown as RawMenu;

function fail(message: string): never {
  throw new Error(`menu.json: ${message}`);
}

/* ------------------------------------------------------------------ */
/* Conversão                                                           */
/* ------------------------------------------------------------------ */

function buildVariants(p: RawProduct): Variant[] {
  const hasPrice = typeof p.price === "number";
  const hasVariants = Array.isArray(p.variants) && p.variants.length > 0;

  if (hasPrice === hasVariants) {
    fail(`o produto "${p.id}" precisa ter 'price' OU 'variants' (exatamente um dos dois).`);
  }
  if (hasPrice) {
    return [{ id: "unico", label: "", price: p.price as number }];
  }

  const seen = new Set<string>();
  return (p.variants ?? []).map((v, index) => {
    const label = (v.label ?? "").trim();
    const id = slugify(label) || `opcao-${index + 1}`;
    if (seen.has(id)) {
      fail(`o produto "${p.id}" tem dois tamanhos/versões com o mesmo nome ("${label}").`);
    }
    seen.add(id);
    return { id, label, price: v.price };
  });
}

function buildGroup(
  productId: string,
  entry: string | RawOptionGroup
): OptionGroup {
  if (typeof entry === "string") {
    const set = raw.optionSets?.[entry];
    if (!set) fail(`o produto "${productId}" usa o conjunto de escolhas "${entry}", que não existe em 'optionSets'.`);
    return { ...set, id: entry };
  }
  return { ...entry, id: entry.id ?? slugify(entry.title) };
}

function buildAddons(productId: string, entry: string | RawAddon[]): Addon[] {
  let list: RawAddon[];
  if (typeof entry === "string") {
    const set = raw.addonSets?.[entry];
    if (!set) fail(`o produto "${productId}" usa o conjunto de adicionais "${entry}", que não existe em 'addonSets'.`);
    list = set;
  } else {
    list = entry;
  }
  return list.map((a) => ({
    id: a.id ?? slugify(a.label),
    label: a.label,
    price: a.price,
  }));
}

if (!Array.isArray(raw.categories) || raw.categories.length === 0) {
  fail("o cardápio precisa ter pelo menos uma categoria em 'categories'.");
}
if (!Array.isArray(raw.products) || raw.products.length === 0) {
  fail("o cardápio precisa ter pelo menos um produto em 'products'.");
}

export const categories: CategoryDef[] = raw.categories.map((c) => ({
  id: c.id,
  label: c.label,
  emoji: c.emoji ?? "",
}));

const categoryIds = new Set(categories.map((c) => c.id));
const productIds = new Set<string>();

export const products: Product[] = raw.products.map((p) => {
  if (productIds.has(p.id)) fail(`existem dois produtos com o mesmo id ("${p.id}").`);
  productIds.add(p.id);

  if (!categoryIds.has(p.category)) {
    fail(`o produto "${p.id}" está na categoria "${p.category}", que não existe em 'categories'.`);
  }

  const optionGroups = (p.optionGroups ?? []).map((g) => buildGroup(p.id, g));
  const addons = p.addons ? buildAddons(p.id, p.addons) : [];
  const variants = buildVariants(p);
  const halfLabel = raw.categories.find((c) => c.id === p.category)?.halfHalfFrom;
  const halfIndex = halfLabel
    ? variants.findIndex((v) => v.label === halfLabel)
    : -1;

  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    image: resolveImage(p.image),
    emoji: p.emoji || undefined,
    category: p.category,
    section: p.section || undefined,
    variants,
    optionGroups: optionGroups.length > 0 ? optionGroups : undefined,
    addons: addons.length > 0 ? addons : undefined,
    halfHalfFrom: halfIndex >= 0 ? halfIndex : undefined,
  };
});

/* ------------------------------------------------------------------ */
/* Destaque da home                                                    */
/* ------------------------------------------------------------------ */

const featuredRaw = raw.featured;

if (featuredRaw && !productIds.has(featuredRaw.product)) {
  fail(`o destaque aponta para o produto "${featuredRaw.product}", que não existe em 'products'.`);
}

/** Produto em destaque na home (ou null se a loja não definiu um) */
export const featuredProduct: Product | null = featuredRaw
  ? (products.find((p) => p.id === featuredRaw.product) as Product)
  : null;

export const featuredTagline: string = featuredRaw?.tagline ?? "";

/** Foto do destaque: a do próprio destaque, ou a do produto */
export const featuredImage: string = featuredRaw
  ? resolveImage(featuredRaw.image) || (featuredProduct?.image ?? "")
  : "";
