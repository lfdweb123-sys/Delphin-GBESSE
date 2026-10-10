"use client";
import { useMemo, useState } from "react";
import { NewsCard, ProjectCard, Empty } from "./Cards";
import { useT } from "./TextsProvider";
import type { Achievement, NewsItem } from "@/types";

export function AchievementList({ items }: { items: Achievement[] }) {
  const t = useT();
  const [cat, setCat] = useState(t.label_all);
  const cats = [t.label_all, ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]))];
  const shown = cat === t.label_all ? items : items.filter((i) => i.category === cat);
  if (!items.length) return <Empty />;
  return (
    <div>
      {cats.length > 2 && (
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
          {cats.map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={`btn ${cat === c ? "btn-primary" : ""}`}>{c}</button>)}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{shown.map((a) => <ProjectCard key={a.id} p={a} />)}</div>
    </div>
  );
}

const PAGE = 9;
export function NewsList({ items }: { items: NewsItem[] }) {
  const t = useT();
  const [q, setQ] = useState(""); const [cat, setCat] = useState(t.label_all); const [page, setPage] = useState(1);
  const cats = [t.label_all, ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]))];
  const filtered = useMemo(() => items.filter((n) =>
    (cat === t.label_all || n.category === cat) &&
    (!q || `${n.title} ${n.content ?? ""}`.toLowerCase().includes(q.toLowerCase()))), [items, q, cat, t.label_all]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PAGE, current * PAGE);
  if (!items.length) return <Empty />;
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1"><span className="sr-only">{t.search_placeholder}</span>
          <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder={t.search_placeholder} className="h-11 w-full rounded-lg border border-line px-4 text-sm" /></label>
        <label><span className="sr-only">Catégorie</span>
          <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }} className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm sm:w-56">
            {cats.map((c) => <option key={c}>{c}</option>)}</select></label>
      </div>
      {slice.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{slice.map((n) => <NewsCard key={n.id} n={n} />)}</div> : <Empty text={t.empty_search} />}
      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3">
          <button type="button" className="btn" disabled={current === 1} onClick={() => setPage(current - 1)}>{t.label_prev}</button>
          <span className="text-sm text-muted">Page {current} / {pages}</span>
          <button type="button" className="btn" disabled={current === pages} onClick={() => setPage(current + 1)}>{t.label_next}</button>
        </nav>
      )}
    </div>
  );
}
