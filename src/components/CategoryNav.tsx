"use client";

import { categories, Category } from "@/data/menu";

export function CategoryNav({
  active,
  onSelect,
}: {
  active: Category;
  onSelect: (c: Category) => void;
}) {
  return (
    <nav className="sticky top-[68px] z-20 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-2xl px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = cat.id === active;
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-brand-gradient text-white shadow-brand"
                    : "bg-brand-pink/10 text-brand-violet/70 hover:bg-brand-pink/20"
                }`}
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
