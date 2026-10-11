import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Quand une bannière existe, elle s'affiche seule (aucun texte dessus).
 * Le titre et l'introduction sont placés juste en dessous.
 */
export default function PageShell({ title, intro, banner, children }: { title: string; intro?: string; banner?: string; children: ReactNode }) {
  return (
    <div className="animate-up">
      {banner && (
        <div className="relative h-44 w-full overflow-hidden bg-soft sm:h-60 md:h-80 lg:h-[26rem]">
          <Image src={banner} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
      )}
      <div className={`container-x ${banner ? "pt-10 sm:pt-12" : "pt-14 sm:pt-20"}`}>
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl whitespace-pre-line leading-7 text-muted">{intro}</p>}
      </div>
      <div className="container-x py-10 sm:py-14">{children}</div>
    </div>
  );
}
