"use client";

import { useCallback, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { FeaturedBanner } from "@/components/FeaturedBanner";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { CartBar } from "@/components/CartBar";
import { Footer } from "@/components/Footer";
import { categories, products, Category, Product } from "@/data/menu";

export default function HomePage() {
  const [active, setActive] = useState<Category>(categories[0].id);
  const [selected, setSelected] = useState<Product | null>(null);

  const closeModal = useCallback(() => setSelected(null), []);

  // Produtos da categoria, agrupados por subtítulo (section), na ordem do menu.ts
  const groups = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const product of products) {
      if (product.category !== active) continue;
      const key = product.section ?? "";
      map.set(key, [...(map.get(key) ?? []), product]);
    }
    return Array.from(map.entries());
  }, [active]);

  const activeLabel = categories.find((c) => c.id === active)?.label;

  return (
    <main className="min-h-screen pb-28">
      <Header />

      <FeaturedBanner onOpen={setSelected} />

      <CategoryNav active={active} onSelect={setActive} />

      <section className="mx-auto max-w-2xl px-4 pt-2">
        <h2 className="mb-3 text-lg font-extrabold text-brand-primary">
          {activeLabel}
        </h2>

        <div className="space-y-6">
          {groups.map(([section, items]) => (
            <div key={section || "geral"}>
              {section && (
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-400">
                  {section}
                </h3>
              )}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <CartBar />

      {selected && (
        <ProductModal
          key={selected.id}
          product={selected}
          onClose={closeModal}
        />
      )}
    </main>
  );
}
