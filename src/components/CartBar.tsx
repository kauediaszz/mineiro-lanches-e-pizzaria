"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export function CartBar() {
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none">
      <div className="mx-auto max-w-2xl pointer-events-auto">
        <Link
          href="/pedido"
          className="flex items-center justify-between gap-3 rounded-2xl bg-brand-gradient px-5 py-4 text-white shadow-brand active:scale-[0.98] transition-transform animate-pop-in"
        >
          <span className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {totalItems}
            </span>
            <span className="font-semibold">Ver pedido</span>
          </span>
          <span className="font-extrabold">{formatPrice(totalPrice)}</span>
        </Link>
      </div>
    </div>
  );
}
