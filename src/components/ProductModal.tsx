"use client";

import { useEffect, useMemo, useState } from "react";
import type { OptionGroup, Product } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { buildCartLine, Choices } from "@/lib/product";
import { ProductImage } from "@/components/ProductImage";

/**
 * Janela de detalhes do produto. A foto "vem pra frente" ao abrir.
 * Use com key={product.id} pra reiniciar as escolhas a cada produto.
 */
export function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addLine } = useCart();

  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [choices, setChoices] = useState<Choices>({});
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Trava o scroll da página e fecha com Esc
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const variant =
    product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const selectedAddons = (product.addons ?? []).filter((a) =>
    addonIds.includes(a.id)
  );

  const unitPrice =
    variant.price + selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const total = unitPrice * quantity;

  const missingGroups = useMemo(
    () =>
      (product.optionGroups ?? []).filter(
        (g) => g.required && (choices[g.id] ?? []).length === 0
      ),
    [product.optionGroups, choices]
  );
  const canAdd = missingGroups.length === 0;

  function toggleOption(group: OptionGroup, option: string) {
    setChoices((prev) => {
      const current = prev[group.id] ?? [];
      const isSelected = current.includes(option);

      if (group.type === "single") {
        // clicar de novo no marcado desmarca (só se não for obrigatório)
        if (isSelected && !group.required) return { ...prev, [group.id]: [] };
        return { ...prev, [group.id]: [option] };
      }

      if (isSelected) {
        return { ...prev, [group.id]: current.filter((o) => o !== option) };
      }
      if (group.max && current.length >= group.max) return prev;
      return { ...prev, [group.id]: [...current, option] };
    });
  }

  function toggleAddon(id: string) {
    setAddonIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

  function handleAdd() {
    if (!canAdd) return;
    addLine(buildCartLine(product, variant, choices, selectedAddons), quantity);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-foreground/60 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[92dvh] w-full max-w-lg animate-sheet-up flex-col overflow-hidden rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl">
        <div className="overflow-y-auto overscroll-contain">
          {/* Foto que vem pra frente */}
          <div className="relative bg-gradient-to-b from-background to-brand-secondary/10 px-6 pb-2 pt-6">
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-xl text-accent shadow-md transition-transform active:scale-90"
            >
              ×
            </button>
            <div className="mx-auto aspect-[4/3] w-[88%] animate-zoom-forward motion-reduce:animate-none">
              <ProductImage
                src={product.image}
                emoji={product.emoji}
                alt={product.name}
                className="h-full w-full rounded-2xl object-cover shadow-brand"
              />
            </div>
          </div>

          <div className="space-y-6 px-5 pb-6 pt-4">
            <div>
              <h2 className="text-xl font-extrabold leading-tight">
                {product.name}
              </h2>
              <p className="mt-1 text-sm leading-snug text-foreground/70">
                {product.description}
              </p>
              {product.variants.length === 1 && (
                <p className="mt-2 text-lg font-extrabold text-accent">
                  {formatPrice(product.variants[0].price)}
                </p>
              )}
            </div>

            {/* Tamanho / versão */}
            {product.variants.length > 1 && (
              <fieldset>
                <legend className="mb-2 text-sm font-bold text-foreground/60 uppercase tracking-wide">
                  Escolha uma opção
                </legend>
                <div className="space-y-2">
                  {product.variants.map((v) => {
                    const active = v.id === variant.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVariantId(v.id)}
                        aria-pressed={active}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all ${
                          active
                            ? "border-transparent bg-brand-gradient text-white shadow-brand"
                            : "border-accent/20 bg-surface text-foreground hover:border-accent/40"
                        }`}
                      >
                        <span>{v.label}</span>
                        <span>{formatPrice(v.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* Escolhas sem custo (sabores, caldas...) */}
            {(product.optionGroups ?? []).map((group) => {
              const picked = choices[group.id] ?? [];
              const limitReached =
                group.type === "multiple" &&
                !!group.max &&
                picked.length >= group.max;

              return (
                <fieldset key={group.id}>
                  <legend className="mb-2 flex w-full items-center justify-between text-sm font-bold text-foreground/60 uppercase tracking-wide">
                    <span>{group.title}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal ${
                        group.required
                          ? "bg-foreground/15 text-accent"
                          : "bg-foreground/10 text-foreground/60"
                      }`}
                    >
                      {group.required ? "Obrigatório" : "Opcional"}
                    </span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((option) => {
                      const active = picked.includes(option);
                      const disabled = limitReached && !active;
                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={disabled}
                          aria-pressed={active}
                          onClick={() => toggleOption(group, option)}
                          className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-all ${
                            active
                              ? "border-transparent bg-brand-gradient text-white shadow-brand"
                              : "border-accent/20 bg-surface text-foreground hover:border-accent/40"
                          } ${disabled ? "opacity-40" : ""}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {group.max && (
                    <p className="mt-1.5 text-[11px] text-foreground/60">
                      Escolha até {group.max}
                    </p>
                  )}
                </fieldset>
              );
            })}

            {/* Adicionais pagos */}
            {(product.addons ?? []).length > 0 && (
              <fieldset>
                <legend className="mb-2 text-sm font-bold text-foreground/60 uppercase tracking-wide">
                  Adicionais
                </legend>
                <div className="space-y-2">
                  {(product.addons ?? []).map((addon) => {
                    const active = addonIds.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleAddon(addon.id)}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-2.5 text-left text-sm font-semibold transition-all ${
                          active
                            ? "border-accent bg-brand-primary/5 text-accent"
                            : "border-accent/20 bg-surface text-foreground hover:border-accent/40"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs ${
                              active
                                ? "border-transparent bg-brand-gradient text-white"
                                : "border-foreground/30"
                            }`}
                            aria-hidden="true"
                          >
                            {active ? "✓" : ""}
                          </span>
                          {addon.label}
                        </span>
                        <span className="text-accent">
                          + {formatPrice(addon.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}
          </div>
        </div>

        {/* Rodapé fixo: quantidade + adicionar */}
        <div className="border-t border-accent/10 bg-surface p-4">
          {!canAdd && (
            <p className="mb-2 text-center text-xs font-semibold text-accent">
              Escolha: {missingGroups.map((g) => g.title).join(", ")}
            </p>
          )}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Diminuir quantidade"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 text-xl font-bold text-accent transition-transform active:scale-90"
              >
                −
              </button>
              <span className="w-6 text-center text-lg font-bold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Aumentar quantidade"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-xl font-bold text-white transition-transform active:scale-90"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className="flex flex-1 items-center justify-between gap-2 rounded-2xl bg-brand-gradient px-5 py-3.5 font-extrabold text-white shadow-brand transition-transform active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
            >
              <span>Adicionar</span>
              <span>{formatPrice(total)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
