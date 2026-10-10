"use client";
import { useState } from "react";
import type { Field, Section } from "@/lib/admin-config";
import { slugify } from "@/lib/data";
import ImageField from "./ImageField";

type Data = Record<string, unknown>;
const input = "mt-1 w-full rounded-lg border border-line bg-white px-3 text-sm";

export default function DocForm({ section, initial, onSave, onCancel }: { section: Section; initial: Data; onSave: (d: Data) => Promise<void>; onCancel?: () => void }) {
  const [d, setD] = useState<Data>(initial);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const set = (k: string, v: unknown) => setD((p) => ({ ...p, [k]: v }));
  const str = (k: string) => (typeof d[k] === "string" ? (d[k] as string) : "");

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const missing = section.fields.find((f) => f.required && !str(f.key).trim());
    if (missing) { setErr(`Champ obligatoire : ${missing.label}`); return; }
    for (const f of section.fields) if (f.type === "url" && str(f.key) && !/^https?:\/\//.test(str(f.key))) { setErr(`${f.label} doit commencer par http:// ou https://`); return; }
    const out = { ...d };
    if (section.collection === "news" && !str("slug")) out.slug = slugify(str("title"));
    setBusy(true);
    try { await onSave(out); } catch (x) { setErr(x instanceof Error ? x.message : "Enregistrement impossible."); } finally { setBusy(false); }
  }

  const render = (f: Field) => {
    const id = `f-${f.key}`;
    if (f.type === "heading") return <h2 key={f.key} className="border-t border-line pt-5 text-lg font-semibold first:border-0 first:pt-0">{f.label}</h2>;
    return (
      <div key={f.key}>
        <label htmlFor={id} className="block text-sm font-medium">{f.label}{f.required && " *"}</label>
        {f.help && <p className="text-xs text-muted">{f.help}</p>}
        {f.type === "textarea" && <textarea id={id} rows={5} className={`${input} py-2`} value={str(f.key)} onChange={(e) => set(f.key, e.target.value)} />}
        {f.type === "select" && <select id={id} className={`${input} h-11`} value={str(f.key)} onChange={(e) => set(f.key, e.target.value)}><option value="">—</option>{f.options?.map((o) => <option key={o}>{o}</option>)}</select>}
        {f.type === "image" && <div className="mt-1"><ImageField value={str(f.key)} onChange={(v) => set(f.key, v)} folder={section.collection} maxSide={f.key === "logoUrl" || f.key === "logo" ? 600 : f.key === "hero_image" || f.key.endsWith("_banner") ? 2400 : 1600} /></div>}
        {["text", "date", "url"].includes(f.type) && <input id={id} type={f.type === "date" ? "date" : "text"} inputMode={f.type === "url" ? "url" : undefined} className={`${input} h-11`} value={str(f.key)} onChange={(e) => set(f.key, e.target.value)} />}
      </div>
    );
  };

  return (
    <form onSubmit={submit} className="card space-y-5 p-5">
      {section.fields.map(render)}
      {!section.noPublish && (
        <fieldset className="grid gap-4 rounded-lg bg-soft p-4 sm:grid-cols-2">
          <legend className="px-1 text-sm font-medium">Publication et source</legend>
          <label className="text-sm">Statut<select className={`${input} h-11`} value={str("status") || "draft"} onChange={(e) => set("status", e.target.value)}><option value="draft">Brouillon</option><option value="published">Publié</option></select></label>
          <label className="text-sm">Vérification<select className={`${input} h-11`} value={str("verificationStatus") || "verified"} onChange={(e) => set("verificationStatus", e.target.value)}><option value="verified">Vérifié</option><option value="needs_review">À vérifier</option></select></label>
          <label className="text-sm">Nom de la source<input className={`${input} h-11`} value={str("sourceName")} onChange={(e) => set("sourceName", e.target.value)} /></label>
          <label className="text-sm">URL de la source<input className={`${input} h-11`} value={str("sourceUrl")} onChange={(e) => set("sourceUrl", e.target.value)} /></label>
          <p className="text-xs text-muted sm:col-span-2">Le public ne voit que les contenus « Publié » et « Vérifié ».</p>
        </fieldset>
      )}
      {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
      <div className="flex gap-3"><button className="btn btn-primary" disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</button>{onCancel && <button type="button" className="btn" onClick={onCancel}>Annuler</button>}</div>
    </form>
  );
}
