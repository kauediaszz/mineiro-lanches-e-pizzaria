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
  addons: Addon[] = []
): Omit<CartItem, "quantity"> {
  const groups = product.optionGroups ?? [];

  const details: string[] = [];
  for (const group of groups) {
    const picked = choices[group.id] ?? [];
    if (picked.length > 0) details.push(`${group.title}: ${picked.join(", ")}`);
  }
  for (const addon of addons) details.push(`+ ${addon.label}`);

  const price =
    variant.price + addons.reduce((sum, addon) => sum + addon.price, 0);

  const lineId = [
    product.id,
    variant.id,
    ...groups.map(
      (g) => `${g.id}=${[...(choices[g.id] ?? [])].sort().join("+")}`
    ),
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
