import { OwlLogo } from "@/components/OwlLogo";

/**
 * Mostra a imagem do produto.
 * - Com "src": mostra a foto.
 * - Sem "src" e com "emoji": emoji grande sobre o gradiente da marca.
 * - Sem nada: gradiente da marca + coruja (imagem padrão).
 * Quando tiver as fotos reais, basta preencher o campo "image" em menu.ts.
 */
export function ProductImage({
  src,
  alt,
  emoji,
  className = "",
}: {
  src: string;
  alt: string;
  emoji?: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-brand-gradient-soft ${className}`}
        role="img"
        aria-label={alt}
      >
        {emoji ? (
          <span className="text-5xl drop-shadow-sm sm:text-6xl" aria-hidden="true">
            {emoji}
          </span>
        ) : (
          <OwlLogo className="h-1/3 w-1/3 text-white/80" />
        )}
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} loading="lazy" />;
}
