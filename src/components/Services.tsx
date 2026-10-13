"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Activity } from "@/types";
import { useT } from "./TextsProvider";

const hrefOf = (s: Activity) => s.url || `/contact?sujet=${encodeURIComponent(`Service : ${s.title}`)}`;

/** Liste de services : une rangée par service (image / texte en alternance), numérotée, avec zoom sur l'image et bouton vers la page contact. */
export default function ServiceList({ items }: { items: Activity[] }) {
  const t = useT();
  const [idx, setIdx] = useState<number | null>(null);
  const zoomable = items.filter((s) => s.image);
  const close = useCallback(() => setIdx(null), []);
  const step = useCallback((d: number) => setIdx((i) => (i === null ? i : (i + d + zoomable.length) % zoomable.length)), [zoomable.length]);

  useEffect(() => {
    if (idx === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    document.addEventListener("keydown", k);
    const o = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = o; };
  }, [idx, close, step]);

  const current = idx !== null ? zoomable[idx] : null;
  return (
    <div>
      <ol className="space-y-8 lg:space-y-10">
        {items.map((s, i) => {
          const href = hrefOf(s);
          const ext = /^https?:\/\//.test(href);
          const zi = zoomable.findIndex((z) => z.id === s.id);
          return (
            <li key={s.id}>
              <article className="grid overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-lg md:grid-cols-2">
                {s.image && (
                  <button type="button" onClick={() => setIdx(zi)} aria-label={`Agrandir l’image : ${s.title}`}
                    className={`group relative block aspect-[16/10] w-full overflow-hidden bg-ink md:aspect-auto md:min-h-[21rem] ${i % 2 ? "md:order-2" : ""}`}>
                    <Image src={s.image} alt={s.title} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-xs font-medium text-white backdrop-blur transition-colors group-hover:bg-gold group-hover:text-black">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" /></svg>
                      Agrandir
                    </span>
                  </button>
                )}
                <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                  <span className="font-serif text-5xl font-semibold leading-none text-gold/80">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 font-serif text-2xl font-semibold leading-snug sm:text-3xl">{s.title}</h3>
                  <span className="mt-5 block h-0.5 w-14 bg-gold" aria-hidden="true" />
                  {s.description && <p className="mt-5 whitespace-pre-line text-base leading-7 text-muted">{s.description}</p>}
                  <div className="mt-8">
                    <Link href={href} className="btn btn-primary" {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{t.label_service_cta} <span aria-hidden="true">→</span></Link>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
      {current && (
        <div role="dialog" aria-modal="true" aria-label="Image du service" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={close}>
          <button type="button" onClick={close} aria-label="Fermer" className="absolute right-4 top-4 h-11 w-11 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20">×</button>
          {zoomable.length > 1 && <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Service précédent" className="absolute left-3 h-11 w-11 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20">‹</button>}
          <figure className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={current.image!} alt={current.title} fill sizes="100vw" className="object-contain" />
            <figcaption className="absolute inset-x-0 -bottom-9 text-center text-sm text-white">{current.title}</figcaption>
          </figure>
          {zoomable.length > 1 && <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Service suivant" className="absolute right-3 h-11 w-11 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20">›</button>}
        </div>
      )}
    </div>
  );
}
