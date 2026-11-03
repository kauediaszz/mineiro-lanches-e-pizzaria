/**
 * Logo placeholder da coruja (SVG inline).
 * Quando tiver o logo real, troque esse componente por uma <img>
 * apontando pra /brand/logo.svg (ja referenciado em config.ts).
 */
export function OwlLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* corpo / cabeca */}
      <path
        d="M12 2c-3.9 0-7 2.9-7 6.8 0 2 .5 3 .5 4.4 0 3.1 2.6 8.8 6.5 8.8s6.5-5.7 6.5-8.8c0-1.4.5-2.4.5-4.4C19 4.9 15.9 2 12 2Z"
        fill="currentColor"
        opacity="0.95"
      />
      {/* olhos */}
      <circle cx="9" cy="9" r="2.6" fill="#1f1033" />
      <circle cx="15" cy="9" r="2.6" fill="#1f1033" />
      <circle cx="9" cy="8.6" r="1" fill="#fff" />
      <circle cx="15" cy="8.6" r="1" fill="#fff" />
      {/* bico */}
      <path d="M12 10.5l-1.2 2h2.4L12 10.5Z" fill="#ec4899" />
      {/* tufos */}
      <path d="M6 4.5l2 2.2M18 4.5l-2 2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
