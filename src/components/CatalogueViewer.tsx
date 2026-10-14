"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const PAGES = 18;
const pages = Array.from({ length: PAGES }, (_, i) => ({ n: i + 1, src: `/catalogue/page-${String(i + 1).padStart(2, "0")}.webp` }));

/** Catalogue GBEDEL : pages en miniatures, visionneuse plein écran (flèches, clavier) et téléchargement du PDF. */
export default function CatalogueViewer() {
  const [idx, setIdx] = useState<number | null>(null);
  const close = useCallback(() => setIdx(null), []);
  const step = useCallback((d: number) => setIdx((i) => (i === null ? i : (i + d + PAGES) % PAGES)), []);
  useEffect(() => {
    if (idx === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    document.addEventListener("keydown", k);
    const o = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = o; };
  }, [idx, close, step]);
  const cur = idx !== null ? pages[idx] : null;
  const nav = "absolute h-11 w-11 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20";

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <a href="/catalogue/Catalogue-GBEDEL.pdf" download className="btn btn-primary">Télécharger le catalogue (PDF) <span aria-hidden="true">↓</span></a>
        <button type="button" onClick={() => setIdx(0)} className="btn">Parcourir le catalogue <span aria-hidden="true">→</span></button>
        <span className="text-sm text-muted">{PAGES} pages · cliquez sur une page pour l’agrandir</span>
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((p, i) => (
          <li key={p.n}>
            <button type="button" onClick={() => setIdx(i)} aria-label={`Agrandir la page ${p.n} du catalogue`}
              className="group relative block w-full overflow-hidden rounded-2xl border border-line bg-soft shadow-sm transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              <Image src={p.src} alt={`Catalogue GBEDEL — page ${p.n}`} width={1600} height={1132} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" loading={i < 3 ? "eager" : "lazy"}
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]" />
              <span className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1 text-xs font-medium text-white">Page {p.n}</span>
            </button>
          </li>
        ))}
      </ul>
      {cur && createPortal(
        <div role="dialog" aria-modal="true" aria-label="Catalogue" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-4 pb-14 pt-16" onClick={close}>
          <button type="button" onClick={close} aria-label="Fermer" className={`${nav} right-4 top-4`}>×</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Page précédente" className={`${nav} left-3`}>‹</button>
          <figure className="relative h-full w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image src={cur.src} alt={`Catalogue GBEDEL — page ${cur.n}`} fill sizes="100vw" className="object-contain" priority />
            <figcaption className="absolute inset-x-0 -bottom-9 text-center text-sm text-white">Page {cur.n} / {PAGES}</figcaption>
          </figure>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Page suivante" className={`${nav} right-3`}>›</button>
        </div>, document.body)}
    </div>
  );
}
