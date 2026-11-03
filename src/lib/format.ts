/** Formata um numero em reais: 24.9 -> "R$ 24,90" */
export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
