import { brandInitial, brandLogo } from "@/lib/brand";

/**
 * Marca da loja em formato de "ícone" quadrado.
 * - Com logo (conteudo/imagens/logo.*): mostra o logo.
 * - Sem logo: mostra a inicial do nome sobre o degradê do tema.
 *
 * Use `className` para definir o tamanho (ex: "h-11 w-11").
 */
export function BrandMark({ className = "h-11 w-11" }: { className?: string }) {
  if (brandLogo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brandLogo}
        alt=""
        className={`${className} shrink-0 rounded-2xl border border-accent/20 bg-surface object-contain p-1 shadow-brand`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${className} flex shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-xl font-extrabold leading-none text-white shadow-brand`}
    >
      {brandInitial}
    </span>
  );
}
