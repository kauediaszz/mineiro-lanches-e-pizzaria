"use client";

import type { Product } from "@/data/menu";
import { featuredProduct, featuredTagline } from "@/data/menu";
import { storeConfig } from "@/data/config";
import { formatPrice } from "@/lib/format";

/**
 * Destaque da home: aviso do Madrugadão no topo + lanche em destaque.
 * A foto usa "mix-blend-multiply", assim o fundo branco dela some
 * e o lanche parece solto sobre o degradê.
 */
export function FeaturedBanner({
  onOpen,
}: {
  onOpen: (product: Product) => void;
}) {
  const product = featuredProduct;

  return (
    <section className="mx-auto max-w-2xl px-4 pt-5" aria-label="Destaque">
      <div className="overflow-hidden rounded-3xl border border-brand-pink/20 bg-gradient-to-br from-brand-violet/10 via-white to-brand-pink/20 shadow-brand">
        {/* Aviso do Madrugadão */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 bg-brand-gradient px-4 py-2.5 text-white">
          <p className="text-sm font-extrabold">{storeConfig.name} 🦉</p>
          <p className="text-[11px] font-medium text-white/90">
            {storeConfig.slogan}
          </p>
        </div>

        {/* Lanche em destaque */}
        <div className="grid grid-cols-[1fr_1.05fr] items-center gap-2 p-4">
          <div>
            <span className="inline-block rounded-full bg-brand-gradient px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              ⭐ Destaque da casa
            </span>
            <h1 className="mt-2 text-xl font-extrabold leading-tight text-[#1f1033] sm:text-2xl">
              {product.name}
            </h1>
            <p className="mt-1 text-xs leading-snug text-gray-500">
              {featuredTagline}
            </p>
            <p className="mt-3 text-2xl font-extrabold text-brand-violet">
              {formatPrice(product.variants[0].price)}
            </p>
            <button
              onClick={() => onOpen(product)}
              className="mt-3 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-bold text-white shadow-brand transition-transform active:scale-95"
            >
              Quero esse!
            </button>
          </div>

          <button
            onClick={() => onOpen(product)}
            aria-label={`Ver detalhes de ${product.name}`}
            className="transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full -rotate-3 mix-blend-multiply"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
