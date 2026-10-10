"use client";
import Image from "next/image";
import { formatDate } from "@/lib/format";
import { useT } from "./TextsProvider";
import type { TimelineEntry } from "@/types";

export default function Timeline({ items }: { items: TimelineEntry[] }) {
  const t = useT();
  return (
    <ol className="relative ml-3 border-l border-line">
      {items.map((x) => (
        <li key={x.id} className="mb-10 ml-6 last:mb-0">
          <span className="absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
          <time dateTime={x.date} className="text-sm text-muted">{formatDate(x.date)}</time>
          <h3 className="mt-1 text-lg font-semibold">{x.title}</h3>
          {x.category && <p className="text-sm text-accent">{x.category}</p>}
          {x.description && <p className="mt-2 max-w-2xl leading-7 text-muted">{x.description}</p>}
          {x.image && <Image src={x.image} alt={x.title} width={480} height={300} className="mt-3 h-auto w-full max-w-md rounded-lg" />}
          {x.url && <a href={x.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-accent hover:underline">{t.label_source}</a>}
        </li>
      ))}
    </ol>
  );
}
