"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductCard } from "@/components/ProductCard";
import { CartBar } from "@/components/CartBar";
import { OwlLogo } from "@/components/OwlLogo";
import { categories, products, Category } from "@/data/menu";
import { storeConfig } from "@/data/config";

export default function HomePage() {
  const [active, setActive] = useState<Category>(categories[0].id);

  const visible = useMemo(
    () => products.filter((p) => p.category === active),
    [active]
  );

  const activeLabel = categories.find((c) => c.id === active)?.label;

  return (
    <main className="min-h-screen pb-28">
      <Header />

      {/* Banner de boas-vindas */}
      <section className="mx-auto max-w-2xl px-4 pt-5">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-5 py-6 text-white shadow-brand">
          <div className="relative z-10 max-w-[75%]">
            <h1 className="text-2xl font-extrabold leading-tight">
              {storeConfig.name} 🦉
            </h1>
            <p className="mt-1 text-sm text-white/90">{storeConfig.slogan}</p>
          </div>
          <OwlLogo className="absolute -right-3 -bottom-3 h-28 w-28 text-white/15" />
        </div>
      </section>

      <CategoryNav active={active} onSelect={setActive} />

      {/* Lista de produtos */}
      <section className="mx-auto max-w-2xl px-4 pt-2">
        <h2 className="mb-3 text-lg font-extrabold text-brand-violet">
          {activeLabel}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <CartBar />
    </main>
  );
}
