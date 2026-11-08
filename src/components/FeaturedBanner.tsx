"use client";

import type { Product } from "@/data/menu";
import { featuredImage, featuredProduct, featuredTagline } from "@/data/menu";
import { storeConfig } from "@/data/config";
import { formatPrice } from "@/lib/format";
import { startingPrice } from "@/lib/product";
import { ProductImage } from "@/components/ProductImage";

/**
 * Destaque da home: aviso da loja no topo + produto em destaque.
 * A foto usa "mix-blend-multiply", assim o fundo branco dela some
 * e o produto parece solto sobre o degradê.
 * Se a loja não definiu um destaque, mostra só o aviso da loja.
 */
export function FeaturedBanner({
  onOpen,
}: {
  onOpen: (product: Product) => void;
}) {
  const product = featuredProduct;
  const title = `${storeConfig.name}${storeConfig.emoji ? ` ${storeConfig.emoji}` : ""}`;
  const TitleTag = product ? "p" : "h1";

  return (
    <section className="mx-auto max-w-2xl px-4 pt-5" aria-label="Destaque">
      <div className="overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-surface via-background to-brand-secondary/40 shadow-brand">
        {/* Aviso da loja */}
        <div
          className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 bg-brand-gradient px-4 text-white ${
            product ? "py-2.5" : "py-5"
          }`}
        >
          <TitleTag className="text-sm font-extrabold">{title}</TitleTag>
          {storeConfig.slogan && (
            <p className="text-[11px] font-medium text-white/90">
              {storeConfig.slogan}
            </p>
          )}
        </div>

        {/* Produto em destaque */}
        {product && (
          <div className="grid grid-cols-[1fr_1.05fr] items-center gap-2 p-4">
            <div>
              <span className="inline-block rounded-full bg-leaf px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                🌿 Destaque da casa
              </span>
              <h1 className="mt-2 text-xl font-extrabold leading-tight text-foreground sm:text-2xl">
                {product.name}
              </h1>
              {featuredTagline && (
                <p className="mt-1 text-xs leading-snug text-foreground/70">
                  {featuredTagline}
                </p>
              )}
              <div className="mt-3">
                {product.variants.length > 1 && (
                  <p className="text-xs font-medium leading-none text-foreground/60">
                    a partir de
                  </p>
                )}
                <p className="text-2xl font-extrabold text-accent">
                  {formatPrice(startingPrice(product))}
                </p>
              </div>
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
              {featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredImage}
                  alt={product.name}
                  className="aspect-square w-full -rotate-3 rounded-2xl object-cover shadow-brand"
                />
              ) : (
                <ProductImage
                  src=""
                  emoji={product.emoji}
                  alt={product.name}
                  className="aspect-square w-full -rotate-3 rounded-2xl"
                />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
