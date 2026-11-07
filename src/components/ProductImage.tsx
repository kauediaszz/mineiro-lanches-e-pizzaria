import { brandInitial, brandLogo } from "@/lib/brand";

/**
 * Mostra a imagem do produto.
 * - Com "src": mostra a foto.
 * - Sem "src" e com "emoji": emoji grande sobre o degradê do tema.
 * - Sem nada: logo da loja (se existir) ou a inicial do nome, sobre o degradê.
 * As fotos vêm do campo "image" de cada produto no cardápio.
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
        ) : brandLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brandLogo}
            alt=""
            className="h-1/3 w-auto max-w-[45%] object-contain opacity-90"
          />
        ) : (
          <span
            className="text-5xl font-extrabold text-white/80 sm:text-6xl"
            aria-hidden="true"
          >
            {brandInitial}
          </span>
        )}
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} loading="lazy" />;
}
