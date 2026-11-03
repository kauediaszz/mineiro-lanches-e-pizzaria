import { storeConfig, PaymentMethod, paymentMethods } from "@/data/config";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/context/CartContext";

interface OrderInfo {
  items: CartItem[];
  total: number;
  address: string;
  payment: PaymentMethod | null;
  changeFor?: string; // troco para (quando dinheiro)
}

/**
 * Monta a mensagem do pedido e devolve a URL do WhatsApp pronta pra abrir.
 */
export function buildWhatsappOrderUrl(order: OrderInfo): string {
  const { items, total, address, payment, changeFor } = order;

  const lines: string[] = [];
  lines.push(`*Novo pedido - ${storeConfig.name}* 🦉`);
  lines.push("");
  lines.push("*Itens:*");

  items.forEach((item) => {
    lines.push(
      `• ${item.quantity}x ${item.name} — ${formatPrice(
        item.price * item.quantity
      )}`
    );
  });

  lines.push("");
  lines.push(`*Total:* ${formatPrice(total)}`);
  lines.push("");

  const paymentLabel =
    paymentMethods.find((p) => p.id === payment)?.label ?? "Nao informado";
  lines.push(`*Forma de pagamento:* ${paymentLabel}`);

  if (payment === "dinheiro" && changeFor && changeFor.trim()) {
    lines.push(`*Troco para:* ${changeFor.trim()}`);
  }

  lines.push("");
  lines.push(`*Endereco de entrega:*`);
  lines.push(address.trim());

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${storeConfig.whatsapp}?text=${text}`;
}
