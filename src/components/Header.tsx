import Link from "next/link";
import { storeConfig } from "@/data/config";
import { OwlLogo } from "@/components/OwlLogo";
import { OpenStatus } from "@/components/OpenStatus";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-brand-pink/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient shadow-brand">
            <OwlLogo className="h-7 w-7 text-white" />
          </div>
          <div className="leading-tight">
            <p className="bg-brand-gradient bg-clip-text text-[15px] font-extrabold text-transparent">
              Madrugadão
            </p>
            <p className="-mt-0.5 text-[11px] font-medium text-brand-violet/60">
              Lanches
            </p>
          </div>
        </Link>

        <div className="ml-auto flex min-w-0 flex-col items-end gap-0.5">
          <a
            href={`https://wa.me/${storeConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chamar no WhatsApp: ${storeConfig.phoneDisplay}`}
            className="flex h-7 items-center gap-1.5 rounded-full bg-brand-gradient px-3 text-xs font-bold text-white shadow-brand transition-transform active:scale-95"
          >
            <span aria-hidden="true">📞</span>
            {storeConfig.phoneDisplay}
          </a>
          <OpenStatus />
        </div>
      </div>
    </header>
  );
}
