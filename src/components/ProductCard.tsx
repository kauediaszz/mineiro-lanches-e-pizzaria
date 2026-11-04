"use client";

import { useState } from "react";
import type { Product } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { buildCartLine, isSimpleProduct, startingPrice } from "@/lib/product";
import { ProductImage } from "@/components/ProductImage";

export function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (product: Product) => void;
}) {
  const { addLine, getProductQuantity } = useCart();
  const quantity = getProductQuantity(product.id);
  const [pulse, setPulse] = useState(false);

  const hasSeveralPrices = product.variants.length > 1;

  // Produto simples entra direto no pedido. Os demais abrem o modal pra escolher.
  function handleQuickAdd() {
    if (!isSimpleProduct(product)) {
      onOpen(product);
      return;
    }
    addLine(buildCartLine(product, product.variants[0]));
    setPulse(true);
    window.setTimeout(() => setPulse(false), 300);
  }

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-brand-pink/10 bg-white shadow-sm transition-all duration-300 ${
        pulse
          ? "z-10 scale-[1.04] shadow-brand"
          : "hover:scale-[1.02] hover:shadow-brand"
      }`}
    >
      <button
        onClick={() => onOpen(product)}
        className="relative aspect-[4/3] w-full overflow-hidden active:scale-95 transition-transform"
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <ProductImage
          src={product.image}
          emoji={product.emoji}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {quantity > 0 && (
          <span className="absolute right-2 top-2 flex h-7 min-w-7 animate-pop-in items-center justify-center rounded-full bg-brand-gradient px-1.5 text-xs font-bold text-white shadow-brand">
            {quantity}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-tight">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-gray-500">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="leading-tight">
            {hasSeveralPrices && (
              <p className="text-[10px] font-medium text-gray-400">a partir de</p>
            )}
            <span className="font-extrabold text-brand-violet">
              {formatPrice(startingPrice(product))}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xl font-bold leading-none text-white shadow-brand transition-transform active:scale-90"
            aria-label={`Adicionar ${product.name}`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
