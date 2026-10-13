"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { GalleryItem } from "@/types";
import { useT } from "./TextsProvider";

export default function Gallery({ items }: { items: GalleryItem[] }) {
  const t = useT();
  const [cat, setCat] = useState(t.label_all);
  const [idx, setIdx] = useState<number | null>(null);
  const cats = [t.label_all, ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]))];
  const shown = cat === t.label_all ? items : items.filter((i) => i.category === cat);
  const close = useCallback(() => setIdx(null), []);
  const step = useCallback((d: number) => setIdx((i) => (i === null ? i : (i + d + shown.length) % shown.length)), [shown.length]);

  useEffect(() => {
    if (idx === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    document.addEventListener("keydown", k);
    const o = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = o; };
  }, [idx, close, step]);

  const current = idx !== null ? shown[idx] : null;
  return (
    <div>
      {cats.length > 2 && (
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
          {cats.map((c) => <button key={c} type="button" onClick={() => setCat(c)} aria-pressed={cat === c} className={`btn ${cat === c ? "btn-primary" : ""}`}>{c}</button>)}
        </div>
      )}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((g, i) => (
          <li key={g.id}>
            <button type="button" onClick={() => setIdx(i)} aria-label={`Agrandir : ${g.alt}`} className="relative block aspect-square w-full overflow-hidden rounded-lg bg-soft">
              <Image src={g.image} alt={g.alt} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw" loading="lazy" className="object-cover object-top transition-transform duration-300 hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>
      {current && (
        <div role="dialog" aria-modal="true" aria-label="Visionneuse d'images" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={close}>
          <button type="button" onClick={close} aria-label="Fermer" className="absolute right-4 top-4 h-11 w-11 rounded-full bg-white/10 text-2xl text-white">×</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Image précédente" className="absolute left-3 h-11 w-11 rounded-full bg-white/10 text-2xl text-white">‹</button>
          <figure className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image src={current.image} alt={current.alt} fill sizes="100vw" className="object-contain" />
            {current.title && <figcaption className="absolute inset-x-0 -bottom-8 text-center text-sm text-white">{current.title}</figcaption>}
          </figure>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Image suivante" className="absolute right-3 h-11 w-11 rounded-full bg-white/10 text-2xl text-white">›</button>
        </div>
      )}
    </div>
  );
}
