"use client";
import Image from "next/image";
import { formatDate } from "@/lib/format";
import type { TimelineEntry } from "@/types";
import ExpandableText from "./ExpandableText";
import { useT } from "./TextsProvider";

/**
 * Parcours : une carte par étape, année en grand à gauche (desktop) ou au-dessus (mobile).
 * Si l'étape a une image, elle s'affiche à gauche du texte, comme dans « À propos ».
 */
export default function Timeline({ items }: { items: TimelineEntry[] }) {
  const t = useT();
  return (
    <ol className="space-y-8 md:space-y-10">
      {items.map((x) => {
        const year = x.date ? x.date.slice(0, 4) : "";
        return (
          <li key={x.id} className="grid gap-4 md:grid-cols-[8rem_minmax(0,1fr)] md:gap-8">
            <div className="md:pt-7 md:text-right">
              <p className="font-serif text-3xl font-semibold leading-none text-accent md:text-4xl">{year}</p>
              <time dateTime={x.date} className="mt-2 block text-sm text-muted">{formatDate(x.date)}</time>
            </div>

            <article className="card self-start overflow-hidden border-t-2 border-t-gold">
              <div className={`grid items-stretch ${x.image ? "md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" : ""}`}>
                {x.image && (
                  <div className="relative aspect-[4/3] bg-soft md:aspect-auto md:min-h-[16rem]">
                    <Image src={x.image} alt={x.title} fill sizes="(min-width:768px) 30vw, 100vw" className="object-cover" />
                  </div>
                )}
                <div className="p-5 sm:p-7">
                  {x.category && <p className="text-xs font-medium uppercase tracking-wide text-accent">{x.category}</p>}
                  <h3 className="mt-1 font-serif text-2xl font-semibold leading-snug">{x.title}</h3>
                  {x.description && (
                    <div className="mt-3">
                      <ExpandableText text={x.description} lines={5} className="leading-7 text-muted" />
                    </div>
                  )}
                  {x.url && (
                    <a href={x.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline">
                      {t.label_source}
                    </a>
                  )}
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
