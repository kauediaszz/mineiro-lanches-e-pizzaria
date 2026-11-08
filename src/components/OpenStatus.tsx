"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, OpenStatus as Status } from "@/lib/hours";

/**
 * Mostra "Aberto agora · até 1h" ou "Fechado · abre hoje às 19h".
 * Só calcula depois que a página carrega no navegador (o site é estático,
 * então o horário "de verdade" só existe no aparelho do cliente).
 */
export function OpenStatus() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  // Espaço reservado enquanto carrega, pra o topo não "pular"
  if (!status) return <p className="h-4" aria-hidden="true" />;
  // Loja sem horário cadastrado
  if (!status.text) return null;

  return (
    <p
      className={`flex items-center justify-end gap-1 truncate text-[11px] font-semibold leading-4 ${
        status.isOpen ? "text-green-400" : "text-foreground/70"
      }`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          status.isOpen ? "animate-pulse bg-green-500" : "bg-foreground/30"
        }`}
        aria-hidden="true"
      />
      <span className="truncate">{status.text}</span>
    </p>
  );
}
