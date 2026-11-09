import type { Addon, Product, Variant } from "@/data/menu";
import type { CartItem } from "@/context/CartContext";

/** Menor preço do produto (usado em "a partir de") */
export function startingPrice(product: Product): number {
  return Math.min(...product.variants.map((v) => v.price));
}

/** true quando o produto não exige nenhuma escolha e pode ser adicionado direto */
export function isSimpleProduct(product: Product): boolean {
  return (
    product.variants.length === 1 &&
    !(product.optionGroups && product.optionGroups.length > 0) &&
    !(product.addons && product.addons.length > 0)
  );
}

/** true se o tamanho escolhido aceita meio a meio */
export function allowsHalfHalf(product: Product, variant: Variant): boolean {
  return (
    product.halfHalfFrom !== undefined &&
    product.variants.indexOf(variant) >= product.halfHalfFrom
  );
}

/** Outros produtos da mesma categoria que podem ser a outra metade */
export function halfHalfCandidates(
  product: Product,
  variant: Variant,
  all: Product[]
): Product[] {
  return all.filter(
    (p) =>
      p.id !== product.id &&
      p.category === product.category &&
      p.variants.some((v) => v.id === variant.id)
  );
}

/** Escolhas feitas pelo cliente: id do grupo -> opções marcadas */
export type Choices = Record<string, string[]>;

/**
 * Monta a linha do carrinho a partir do que o cliente escolheu.
 * O "lineId" é único por combinação, então "Açaí 300ml banana" e
 * "Açaí 500ml morango" viram linhas diferentes.
 */
export function buildCartLine(
  product: Product,
  variant: Variant,
  choices: Choices = {},
  addons: Addon[] = [],
  half?: Product
): Omit<CartItem, "quantity"> {
  const groups = product.optionGroups ?? [];

  const details: string[] = [];
  for (const group of groups) {
    const picked = choices[group.id] ?? [];
    if (picked.length > 0) details.push(`${group.title}: ${picked.join(", ")}`);
  }
  // Meio a meio: cobra o sabor mais caro entre os dois, no mesmo tamanho
  const halfVariant = half?.variants.find((v) => v.id === variant.id);
  const basePrice = halfVariant
    ? Math.max(variant.price, halfVariant.price)
    : variant.price;
  if (half) details.unshift(`Meio a meio: ½ ${product.name} + ½ ${half.name}`);
  for (const addon of addons) details.push(`+ ${addon.label}`);

  const price =
    basePrice + addons.reduce((sum, addon) => sum + addon.price, 0);

  const lineId = [
    product.id,
    variant.id,
    ...groups.map(
      (g) => `${g.id}=${[...(choices[g.id] ?? [])].sort().join("+")}`
    ),
    half ? `meio=${half.id}` : "",
    addons
      .map((a) => a.id)
      .sort()
      .join("+"),
  ].join("|");

  return {
    lineId,
    productId: product.id,
    name: product.name,
    variantLabel: variant.label || undefined,
    details,
    price,
  };
}
