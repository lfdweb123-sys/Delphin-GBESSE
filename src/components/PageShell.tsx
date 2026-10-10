import Image from "next/image";
import type { ReactNode } from "react";

/** En-tête de page avec bannière optionnelle (modifiable depuis le dashboard). */
export default function PageShell({ title, intro, banner, children }: { title: string; intro?: string; banner?: string; children: ReactNode }) {
  return (
    <div className="animate-up">
      {banner ? (
        <div className="relative isolate overflow-hidden bg-ink">
          <Image src={banner} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-60" />
          <div className="container-x py-14 text-white sm:py-20 md:py-28">
            <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            {intro && <p className="mt-4 max-w-2xl whitespace-pre-line leading-7 text-white/90">{intro}</p>}
          </div>
        </div>
      ) : (
        <div className="container-x pt-14 sm:pt-20">
          <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          {intro && <p className="mt-4 max-w-2xl whitespace-pre-line leading-7 text-muted">{intro}</p>}
        </div>
      )}
      <div className="container-x py-10 sm:py-14">{children}</div>
    </div>
  );
}
