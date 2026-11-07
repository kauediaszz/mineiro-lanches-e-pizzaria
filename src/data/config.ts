/**
 * DADOS DA LOJA (carregador)
 * ---------------------------------------------------------------
 * ESTE ARQUIVO NÃO MUDA de loja para loja.
 * Os dados vêm de src/data/store.json, que é GERADO a partir do bloco
 * "Identidade" do conteudo/tema.md (veja o AGENTS.md).
 */
import storeData from "./store.json";

export interface ScheduleSlot {
  /** Dias da semana em que esse horário vale (0 = domingo ... 6 = sábado) */
  days: number[];
  /** Texto mostrado no rodapé, ex: "Seg, Ter e Qua" */
  label: string;
  /** Abre às (24h), ex: "19:00" */
  open: string;
  /** Fecha às (24h). Se for menor que "open", fecha depois da meia-noite. */
  close: string;
}

export interface StoreConfig {
  name: string;
  slogan: string;
  /** Emoji opcional que acompanha o nome (ex: "🍕"). Vazio = não mostra. */
  emoji: string;
  /** WhatsApp no formato internacional, sem símbolos (55 + DDD + número) */
  whatsapp: string;
  /** Como o número aparece escrito no site, ex: "(21) 99999-0000" */
  phoneDisplay: string;
  address: string;
  /** Link completo do Instagram ou vazio */
  instagram: string;
  /** Aviso sobre entrega mostrado na tela do pedido */
  deliveryInfo: string;
  hours: {
    schedule: ScheduleSlot[];
    /** Ex: "Segunda é folga!" (opcional) */
    closedNote: string;
  };
}

interface RawStore {
  name: string;
  slogan?: string;
  emoji?: string;
  whatsapp: string;
  address?: string;
  instagram?: string;
  deliveryInfo?: string;
  hours?: { schedule?: ScheduleSlot[]; closedNote?: string };
}

const raw = storeData as unknown as RawStore;

/** Aceita o link completo ou só o @usuario e devolve sempre o link */
function normalizeInstagram(value: string): string {
  const v = value.trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://instagram.com/${v.replace(/^@/, "")}`;
}

/** "5521990251700" -> "(21) 99025-1700" (se não reconhecer o formato, devolve como veio) */
function formatPhone(whatsapp: string): string {
  const match = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(whatsapp);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : whatsapp;
}

// Falha cedo (no build) se os dados essenciais estiverem errados: melhor do que
// publicar um site cujo botão de pedido manda mensagem para o número errado.
if (!raw.name || !raw.name.trim()) {
  throw new Error("store.json: o campo 'name' (nome da loja) é obrigatório.");
}
if (!/^\d{12,13}$/.test(raw.whatsapp ?? "")) {
  throw new Error(
    `store.json: 'whatsapp' inválido ("${raw.whatsapp}"). Use 55 + DDD + número, só dígitos (ex: 5521999990000).`
  );
}

export const storeConfig: StoreConfig = {
  name: raw.name.trim(),
  slogan: raw.slogan ?? "",
  emoji: raw.emoji ?? "",
  whatsapp: raw.whatsapp,
  phoneDisplay: formatPhone(raw.whatsapp),
  address: raw.address ?? "",
  instagram: normalizeInstagram(raw.instagram ?? ""),
  deliveryInfo:
    raw.deliveryInfo ?? "Consulte a taxa de entrega no WhatsApp",
  hours: {
    schedule: raw.hours?.schedule ?? [],
    closedNote: raw.hours?.closedNote ?? "",
  },
};

export type PaymentMethod = "pix" | "cartao" | "dinheiro";

export const paymentMethods: { id: PaymentMethod; label: string; emoji: string }[] = [
  { id: "pix", label: "Pix", emoji: "💠" },
  { id: "cartao", label: "Cartão", emoji: "💳" },
  { id: "dinheiro", label: "Dinheiro", emoji: "💵" },
];
