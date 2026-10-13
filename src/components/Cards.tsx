"use client";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Achievement, EventItem, NewsItem, Organization, Project } from "@/types";
import ExpandableText from "./ExpandableText";
import { useT } from "./TextsProvider";

function Cover({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null;
  return <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl bg-soft"><Image src={src} alt={alt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover object-top" /></div>;
}
function Ext({ url, label }: { url?: string; label: string }) {
  return url ? <a href={url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline">{label}</a> : null;
}

/* `self-start` : une carte qui s'agrandit avec « Lire plus » n'étire pas les cartes voisines. */
export function EventCard({ e }: { e: EventItem }) {
  const t = useT();
  return (
    <article className="card flex flex-col self-start">
      <Cover src={e.image} alt={e.title} />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm text-muted">{formatDate(e.date)}{e.time ? ` — ${e.time}` : ""}</p>
        <h3 className="mt-1 text-lg font-semibold">{e.title}</h3>
        {e.location && <p className="mt-1 text-sm text-muted">{e.location}</p>}
        {e.description && <div className="mt-3"><ExpandableText text={e.description} className="text-sm leading-6 text-muted" /></div>}
        <Ext url={e.url} label={t.label_more} />
      </div>
    </article>
  );
}
export function ProjectCard({ p }: { p: Project | Achievement }) {
  const t = useT();
  const result = typeof p.result === "string" ? p.result : "";
  return (
    <article className="card flex flex-col self-start">
      <Cover src={p.image} alt={p.title} />
      <div className="flex flex-1 flex-col p-5">
        {p.category && <p className="text-sm text-accent">{p.category}</p>}
        <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
        {p.date && <p className="text-sm text-muted">{formatDate(p.date)}</p>}
        {p.description && <div className="mt-3"><ExpandableText text={p.description} className="text-sm leading-6 text-muted" /></div>}
        {result && <p className="mt-3 text-sm"><strong>{t.label_result} :</strong> {result}</p>}
        <Ext url={p.url} label={t.label_more} />
      </div>
    </article>
  );
}
export function NewsCard({ n }: { n: NewsItem }) {
  const t = useT();
  return (
    <article className="card flex flex-col self-start">
      <Cover src={n.image} alt={n.title} />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm text-muted">{formatDate(n.date)}{n.category ? ` — ${n.category}` : ""}</p>
        <h3 className="mt-1 text-lg font-semibold"><Link href={`/actualites/${n.slug}`} className="hover:underline">{n.title}</Link></h3>
        {n.content && <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{n.content.slice(0, 220)}</p>}
        <Link href={`/actualites/${n.slug}`} className="mt-3 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline">{t.label_read_article}</Link>
      </div>
    </article>
  );
}
export function OrganizationCard({ o }: { o: Organization }) {
  const t = useT();
  return (
    <article className="card flex gap-4 p-5">
      {o.logo && <Image src={o.logo} alt={`Logo ${o.name}`} width={56} height={56} className="h-14 w-14 shrink-0 object-contain" />}
      <div className="min-w-0">
        <h3 className="font-semibold">{o.name}</h3>
        {(o.role || o.period) && <p className="text-sm text-muted">{[o.role, o.period].filter(Boolean).join(" · ")}</p>}
        {o.description && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">{o.description}</p>}
        <Ext url={o.website} label={t.label_website} />
      </div>
    </article>
  );
}
export function Empty({ text }: { text?: string }) {
  const t = useT();
  return <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">{text ?? t.empty_text}</p>;
}
