"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { buildWhatsappOrderUrl } from "@/lib/whatsapp";
import { paymentMethods, PaymentMethod, storeConfig } from "@/data/config";
import { OwlLogo } from "@/components/OwlLogo";

export default function PedidoPage() {
  const { items, totalPrice, totalItems, increment, decrement, removeItem } =
    useCart();

  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [changeFor, setChangeFor] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (items.length === 0) {
      setError("Seu pedido está vazio.");
      return;
    }
    if (!address.trim()) {
      setError("Preencha o endereço de entrega.");
      return;
    }
    if (!payment) {
      setError("Escolha a forma de pagamento.");
      return;
    }
    setError("");

    const url = buildWhatsappOrderUrl({
      items,
      total: totalPrice,
      address,
      payment,
      changeFor,
    });
    window.open(url, "_blank");
  }

  // Carrinho vazio
  if (totalItems === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="h-20 w-20 rounded-3xl bg-brand-gradient-soft flex items-center justify-center">
          <OwlLogo className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-xl font-extrabold text-brand-violet">
          Seu pedido está vazio
        </h1>
        <p className="text-sm text-gray-500">
          Volte ao cardápio e escolha seus lanches.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-full bg-brand-gradient px-6 py-3 text-white font-semibold shadow-brand active:scale-95 transition-transform"
        >
          Ver cardápio
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-40">
      {/* Topo */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-brand-pink/10">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="h-10 w-10 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-violet text-xl active:scale-90 transition-transform"
            aria-label="Voltar"
          >
            ←
          </Link>
          <h1 className="font-extrabold text-lg text-brand-violet">
            Seu pedido
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-4 space-y-6">
        {/* Itens */}
        <section>
          <h2 className="mb-2 text-sm font-bold text-gray-400 uppercase tracking-wide">
            Itens
          </h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.lineId}
                className="flex items-center gap-3 rounded-2xl bg-white border border-brand-pink/10 p-3 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm">{item.name}</p>
                  {item.variantLabel && (
                    <p className="text-xs font-semibold text-gray-500">
                      {item.variantLabel}
                    </p>
                  )}
                  {item.details.map((detail) => (
                    <p
                      key={detail}
                      className="text-[11px] leading-snug text-gray-400"
                    >
                      {detail}
                    </p>
                  ))}
                  <p className="mt-0.5 text-xs text-brand-violet font-semibold">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrement(item.lineId)}
                    className="h-8 w-8 rounded-full bg-brand-pink/10 text-brand-violet text-lg font-bold flex items-center justify-center active:scale-90 transition-transform"
                    aria-label="Remover um"
                  >
                    −
                  </button>
                  <span className="w-4 text-center font-bold text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increment(item.lineId)}
                    className="h-8 w-8 rounded-full bg-brand-gradient text-white text-lg font-bold flex items-center justify-center active:scale-90 transition-transform"
                    aria-label="Adicionar um"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.lineId)}
                  className="text-gray-300 hover:text-brand-pink text-xl px-1"
                  aria-label="Remover item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Endereco */}
        <section>
          <h2 className="mb-2 text-sm font-bold text-gray-400 uppercase tracking-wide">
            Endereço de entrega
          </h2>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="Rua, número, bairro, complemento e ponto de referência"
            className="w-full rounded-2xl border border-brand-pink/20 bg-white p-4 text-sm outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 resize-none"
          />
          <p className="mt-1 text-[11px] text-gray-400">
            {storeConfig.deliveryInfo}
          </p>
        </section>

        {/* Pagamento */}
        <section>
          <h2 className="mb-2 text-sm font-bold text-gray-400 uppercase tracking-wide">
            Forma de pagamento
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((method) => {
              const isActive = payment === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setPayment(method.id)}
                  className={`rounded-2xl border p-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "border-transparent bg-brand-gradient text-white shadow-brand"
                      : "border-brand-pink/20 bg-white text-brand-violet/70 hover:border-brand-violet/40"
                  }`}
                >
                  <span className="block text-xl mb-0.5">{method.emoji}</span>
                  {method.label}
                </button>
              );
            })}
          </div>

          {payment === "dinheiro" && (
            <div className="mt-3 animate-pop-in">
              <label className="text-xs font-semibold text-gray-500">
                Precisa de troco? Troco para:
              </label>
              <input
                value={changeFor}
                onChange={(e) => setChangeFor(e.target.value)}
                placeholder="Ex: R$ 50,00 (deixe vazio se não precisar)"
                className="mt-1 w-full rounded-2xl border border-brand-pink/20 bg-white p-3 text-sm outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20"
              />
            </div>
          )}
        </section>

        {/* Total */}
        <section className="rounded-2xl bg-brand-pink/5 p-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Subtotal ({totalItems} itens)</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between font-extrabold text-lg text-brand-violet">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </section>

        {error && (
          <p className="text-center text-sm font-semibold text-brand-pink animate-pop-in">
            {error}
          </p>
        )}
      </div>

      {/* Botao fixo de fazer pedido */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-white via-white to-transparent">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-gradient px-5 py-4 text-white font-extrabold text-lg shadow-brand active:scale-[0.98] transition-transform"
          >
            <WhatsappIcon className="h-5 w-5" />
            Fazer pedido no WhatsApp
          </button>
        </div>
      </div>
    </main>
  );
}

function WhatsappIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
