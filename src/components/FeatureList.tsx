"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { formatDate } from "@/lib/format";
import type { Activity, Achievement, TimelineEntry } from "@/types";
import ExpandableText from "./ExpandableText";
import { useT } from "./TextsProvider";

export interface FeatureItem {
  id: string; title: string; description?: string; image?: string;
  /** Grand repère à gauche du titre : numéro (01), année (2026)… */
  marker?: string; kicker?: string; dateLabel?: string;
  facts?: { label: string; value: string }[];
  /** Lien du bouton principal (défaut : page contact avec l'objet prérempli). */
  href: string; ctaLabel?: string;
  secondary?: { href: string; label: string };
}

const isExt = (h: string) => /^https?:\/\//.test(h);
const contact = (prefix: string, title: string) => `/contact?sujet=${encodeURIComponent(`${prefix} : ${title}`)}`;

/** Une rangée par élément : image / texte en alternance, repère doré, bouton d'appel à l'action et zoom plein écran sur l'image. */
export default function FeatureList({ items }: { items: FeatureItem[] }) {
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
          const zi = zoomable.findIndex((z) => z.id === s.id);
          return (
            <li key={s.id}>
              <article className="grid overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-lg md:grid-cols-2">
                {s.image && (
                  <button type="button" onClick={() => setIdx(zi)} aria-label={`Agrandir l’image : ${s.title}`}
                    className={`group relative block aspect-[16/10] w-full overflow-hidden bg-ink md:aspect-auto md:min-h-[21rem] ${i % 2 ? "md:order-2" : ""}`}>
                    <Image src={s.image} alt={s.title} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-xs font-medium text-white backdrop-blur transition-colors group-hover:bg-gold group-hover:text-black">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" /></svg>
                      Agrandir
                    </span>
                  </button>
                )}
                <div className={`flex min-w-0 flex-col justify-center p-6 sm:p-10 lg:p-12 ${s.image ? "" : "md:col-span-2"}`}>
                  {s.marker && <span className="font-serif text-5xl font-semibold leading-none text-gold/80">{s.marker}</span>}
                  {(s.kicker || s.dateLabel) && (
                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-accent">{[s.kicker, s.dateLabel].filter(Boolean).join(" — ")}</p>
                  )}
                  <h3 className="mt-3 font-serif text-2xl font-semibold leading-snug sm:text-3xl">{s.title}</h3>
                  <span className="mt-5 block h-0.5 w-14 bg-gold" aria-hidden="true" />
                  {s.description && <div className="mt-5"><ExpandableText text={s.description} lines={6} className="text-base leading-7 text-muted" /></div>}
                  {s.facts && s.facts.length > 0 && (
                    <dl className="mt-5 space-y-1 text-sm">{s.facts.map((f) => <div key={f.label}><dt className="inline font-semibold">{f.label} : </dt><dd className="inline whitespace-pre-line text-muted">{f.value}</dd></div>)}</dl>
                  )}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={s.href} className="btn btn-primary" {...(isExt(s.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{s.ctaLabel || t.label_service_cta} <span aria-hidden="true">→</span></Link>
                    {s.secondary && <Link href={s.secondary.href} className="btn" {...(isExt(s.secondary.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{s.secondary.label}</Link>}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
      {current && createPortal(
        <div role="dialog" aria-modal="true" aria-label="Image agrandie" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-4 pb-14 pt-16" onClick={close}>
          <button type="button" onClick={close} aria-label="Fermer" className="absolute right-4 top-4 h-11 w-11 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20">×</button>
          {zoomable.length > 1 && <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Image précédente" className="absolute left-3 h-11 w-11 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20">‹</button>}
          <figure className="relative h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={current.image!} alt={current.title} fill sizes="100vw" className="object-contain object-center" />
            <figcaption className="absolute inset-x-0 -bottom-9 text-center text-sm text-white">{current.title}</figcaption>
          </figure>
          {zoomable.length > 1 && <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Image suivante" className="absolute right-3 h-11 w-11 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20">›</button>}
        </div>, document.body)}
    </div>
  );
}

/** Services : numérotés (01, 02…), bouton vers la page contact. */
export function ServiceList({ items }: { items: Activity[] }) {
  return <FeatureList items={items.map((s, i) => ({ id: s.id, title: s.title, description: s.description, image: s.image, marker: String(i + 1).padStart(2, "0"), href: s.url || contact("Service", s.title) }))} />;
}
/** Parcours : l'année sert de repère. */
export function TimelineList({ items }: { items: TimelineEntry[] }) {
  const t = useT();
  return <FeatureList items={items.map((x) => ({
    id: x.id, title: x.title, description: x.description, image: x.image, marker: x.date?.slice(0, 4), kicker: x.category, dateLabel: x.date ? formatDate(x.date) : undefined,
    href: contact("Parcours", x.title), secondary: x.url ? { href: x.url, label: t.label_source } : undefined,
  }))} />;
}
/** Matériels (collection `achievements`) : numérotés ou datés, détails en information complémentaire. */
export function AchievementFeatures({ items }: { items: Achievement[] }) {
  const t = useT();
  return <FeatureList items={items.map((a, i) => ({
    id: a.id, title: a.title, description: a.description, image: a.image, marker: a.date ? a.date.slice(0, 4) : String(i + 1).padStart(2, "0"), kicker: a.category,
    dateLabel: a.date ? formatDate(a.date) : undefined, facts: a.result ? [{ label: "Détails", value: a.result }] : undefined,
    href: contact("Matériel", a.title), secondary: a.url ? { href: a.url, label: t.label_more } : undefined,
  }))} />;
}
