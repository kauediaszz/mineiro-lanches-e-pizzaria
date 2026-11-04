/**
 * CONFIGURAÇÕES DA LANCHONETE
 * ---------------------------------------------------------------
 * Esse é o arquivo que você edita pra trocar as informações da loja.
 * Nada aqui depende do resto do código, é só trocar os valores.
 */

export interface ScheduleSlot {
  /** Dias da semana em que esse horário vale (0 = domingo ... 6 = sábado) */
  days: number[];
  /** Texto mostrado no rodapé */
  label: string;
  /** Abre às (24h) */
  open: string;
  /** Fecha às (24h). Se for menor que "open", fecha depois da meia-noite. */
  close: string;
}

export const storeConfig = {
  // Nome exibido no site
  name: "Madrugadão Lanches",
  slogan: "A fome não dorme, a gente também não.",

  // 🔧 WhatsApp no formato internacional (55 + DDD + número), sem símbolos.
  // (Hoje é o número de teste. Trocar pelo número da lanchonete depois.)
  whatsapp: "5521990251700",
  // Como o número aparece escrito no topo do site
  phoneDisplay: "(21) 99025-1700",

  // Horário de funcionamento
  hours: {
    schedule: [
      {
        days: [1, 2, 3],
        label: "Seg, Ter e Qua",
        open: "19:00",
        close: "01:00",
      },
      {
        days: [5, 6, 0],
        label: "Sex, Sáb e Dom",
        open: "19:00",
        close: "02:00",
      },
    ] as ScheduleSlot[],
    closedNote: "Quinta é folga!",
  },

  // 🔧 Endereço da loja (fictício por enquanto)
  address: "Rua da Madrugada, 123 - Centro, Rio de Janeiro - RJ",

  // 🔧 Redes sociais (deixe vazio pra esconder o link)
  social: {
    instagram: "", // ex: "https://instagram.com/madrugadaolanches"
  },

  // Caminho do logo (coloque o arquivo em /public/brand/)
  logo: "/brand/logo.svg",

  // Taxa de entrega exibida como informação (não entra no total automático)
  deliveryInfo: "Consulte a taxa de entrega no WhatsApp",
};

export type PaymentMethod = "pix" | "cartao" | "dinheiro";

export const paymentMethods: { id: PaymentMethod; label: string; emoji: string }[] = [
  { id: "pix", label: "Pix", emoji: "💠" },
  { id: "cartao", label: "Cartão", emoji: "💳" },
  { id: "dinheiro", label: "Dinheiro", emoji: "💵" },
];
