import { OwlLogo } from "@/components/OwlLogo";

/**
 * Mostra a imagem do produto. Se "src" estiver vazio, mostra um
 * placeholder com o gradiente da marca + coruja.
 * Quando tiver as fotos reais, basta preencher o campo "image" em menu.ts.
 */
export function ProductImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-brand-gradient-soft ${className}`}
      >
        <OwlLogo className="h-1/3 w-1/3 text-white/80" />
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} />;
}
