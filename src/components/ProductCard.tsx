"use client";

import { useState } from "react";
import type { Product } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, getQuantity, increment, decrement } = useCart();
  const quantity = getQuantity(product.id);
  const [pulse, setPulse] = useState(false);

  function handleAdd() {
    addItem(product);
    // dispara a animacao de "crescer / vir pra frente"
    setPulse(true);
    window.setTimeout(() => setPulse(false), 300);
  }

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-brand-pink/10 shadow-sm transition-all duration-300 ${
        pulse
          ? "scale-[1.04] shadow-brand z-10"
          : "hover:scale-[1.02] hover:shadow-brand"
      }`}
    >
      <button
        onClick={handleAdd}
        className="relative aspect-[4/3] w-full overflow-hidden"
        aria-label={`Adicionar ${product.name}`}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-300 ${
            pulse ? "scale-110" : "group-hover:scale-105"
          }`}
        />
        {quantity > 0 && (
          <span className="absolute top-2 right-2 h-7 min-w-7 px-1.5 rounded-full bg-brand-gradient text-white text-xs font-bold flex items-center justify-center shadow-brand animate-pop-in">
            {quantity}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-bold text-sm leading-tight">{product.name}</h3>
        <p className="mt-1 text-[11px] text-gray-500 leading-snug line-clamp-2">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-extrabold text-brand-violet">
            {formatPrice(product.price)}
          </span>

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="h-9 w-9 rounded-full bg-brand-gradient text-white text-xl font-bold leading-none flex items-center justify-center shadow-brand active:scale-90 transition-transform"
              aria-label="Adicionar"
            >
              +
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => decrement(product.id)}
                className="h-8 w-8 rounded-full bg-brand-pink/10 text-brand-violet text-lg font-bold flex items-center justify-center active:scale-90 transition-transform"
                aria-label="Remover um"
              >
                −
              </button>
              <span className="w-4 text-center font-bold text-sm">
                {quantity}
              </span>
              <button
                onClick={() => increment(product.id)}
                className="h-8 w-8 rounded-full bg-brand-gradient text-white text-lg font-bold flex items-center justify-center active:scale-90 transition-transform"
                aria-label="Adicionar um"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
