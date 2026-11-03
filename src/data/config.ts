/**
 * CONFIGURACOES DA LANCHONETE
 * ---------------------------------------------------------------
 * Esse e o arquivo que voce edita pra trocar as informacoes da loja.
 * Nada aqui depende do resto do codigo, e so trocar os valores.
 */

export const storeConfig = {
  // Nome exibido no site
  name: "Madrugadao Lanches",
  slogan: "A fome nao dorme, a gente tambem nao.",

  // 🔧 WhatsApp no formato internacional (55 + DDD + numero), sem simbolos.
  whatsapp: "5521990251700",

  // 🔧 Horario de funcionamento (ficticio por enquanto)
  hours: {
    label: "Aberto todos os dias",
    time: "18h as 04h",
  },

  // 🔧 Endereco da loja (ficticio por enquanto)
  address: "Rua da Madrugada, 123 - Centro, Rio de Janeiro - RJ",

  // 🔧 Redes sociais (deixe vazio pra esconder o link)
  social: {
    instagram: "", // ex: "https://instagram.com/madrugadaolanches"
  },

  // Caminho do logo (coloque o arquivo em /public/brand/)
  logo: "/brand/logo.svg",

  // Taxa de entrega exibida como informacao (nao entra no total automatico)
  deliveryInfo: "Consulte a taxa de entrega no WhatsApp",
};

export type PaymentMethod = "pix" | "cartao" | "dinheiro";

export const paymentMethods: { id: PaymentMethod; label: string; emoji: string }[] = [
  { id: "pix", label: "Pix", emoji: "💠" },
  { id: "cartao", label: "Cartao", emoji: "💳" },
  { id: "dinheiro", label: "Dinheiro", emoji: "💵" },
];
