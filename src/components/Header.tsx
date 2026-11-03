import Link from "next/link";
import { storeConfig } from "@/data/config";
import { OwlLogo } from "@/components/OwlLogo";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-brand-pink/10">
      <div className="mx-auto max-w-2xl px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-11 w-11 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-brand">
            <OwlLogo className="h-7 w-7 text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-extrabold text-[15px] bg-brand-gradient bg-clip-text text-transparent">
              Madrugadao
            </p>
            <p className="text-[11px] font-medium text-brand-violet/60 -mt-0.5">
              Lanches
            </p>
          </div>
        </Link>

        <div className="ml-auto text-right">
          <p className="text-[11px] font-semibold text-brand-violet flex items-center gap-1 justify-end">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            {storeConfig.hours.label}
          </p>
          <p className="text-[11px] text-gray-500 font-medium">
            {storeConfig.hours.time}
          </p>
        </div>
      </div>
    </header>
  );
}
