"use client";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import type { Section } from "@/lib/admin-config";
import { db } from "@/lib/firebase";
import DocForm from "./DocForm";

type Row = Record<string, unknown> & { id: string };
const now = () => new Date().toISOString();
const clean = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).filter(([k, v]) => v !== undefined && k !== "id"));

/** Éditeur pour les documents uniques (profile/main, settings/main). */
export function SingleEditor({ section }: { section: Section }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null); const [msg, setMsg] = useState("");
  useEffect(() => { getDoc(doc(db, section.collection, section.docId ?? "main")).then((s) => setData(s.exists() ? s.data() : { status: "published", verificationStatus: "verified" })); }, [section.collection, section.docId]);
  if (!data) return <p className="text-sm text-muted">Chargement…</p>;
  return (
    <div className="space-y-3">
      {msg && <p role="status" className="text-sm text-accent">{msg}</p>}
      <DocForm section={{ ...section, noPublish: true }} initial={data} onSave={async (d) => {
        await setDoc(doc(db, section.collection, section.docId ?? "main"), { ...clean(d), status: "published", verificationStatus: "verified", updatedAt: now() }, { merge: true });
        setMsg("Enregistré. Le site se met à jour en moins d’une minute."); }} />
    </div>
  );
}

/** Liste + création / édition / publication / suppression pour une collection. */
export function CollectionManager({ section }: { section: Section }) {
  const [rows, setRows] = useState<Row[]>([]); const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | "new" | null>(null); const [err, setErr] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    try { const s = await getDocs(collection(db, section.collection)); setRows(s.docs.map((d) => ({ ...d.data(), id: d.id }))); }
    catch { setErr("Lecture impossible : vérifiez les règles Firestore et votre statut d’administrateur."); }
    setLoading(false);
  }, [section.collection]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("edit");
    if (id && rows.length) { const r = rows.find((x) => x.id === id); if (r) setEditing(r); }
  }, [rows]);

  async function save(d: Record<string, unknown>) {
    const base = { ...clean(d), updatedAt: now() };
    if (!section.noPublish) { base.status = base.status || "draft"; base.verificationStatus = base.verificationStatus || "verified"; }
    if (editing && editing !== "new") await updateDoc(doc(db, section.collection, editing.id), base);
    else await addDoc(collection(db, section.collection), { ...base, createdAt: now(), _ts: serverTimestamp() });
    setEditing(null); await load();
  }
  const patch = async (r: Row, p: Record<string, unknown>) => { await updateDoc(doc(db, section.collection, r.id), { ...p, updatedAt: now() }); await load(); };
  const remove = async (r: Row) => { if (confirm("Supprimer définitivement cet élément ?")) { await deleteDoc(doc(db, section.collection, r.id)); await load(); } };

  if (editing) return <DocForm section={section} initial={editing === "new" ? { status: "draft", verificationStatus: "verified" } : editing} onSave={save} onCancel={() => setEditing(null)} />;
  return (
    <div>
      <button className="btn btn-primary mb-5" onClick={() => setEditing("new")}>Ajouter</button>
      {err && <p role="alert" className="mb-4 text-sm text-red-700">{err}</p>}
      {loading ? <p className="text-sm text-muted">Chargement…</p> : rows.length === 0 ? <p className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">Aucun élément. Cliquez sur « Ajouter » pour créer le premier.</p> : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{String(r[section.titleKey] || "(sans titre)")}</p>
                {!section.noPublish && <p className="text-xs text-muted">{r.status === "published" ? "Publié" : "Brouillon"} · {r.verificationStatus === "needs_review" ? "À vérifier" : "Vérifié"}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {!section.noPublish && <button className="btn" onClick={() => patch(r, r.status === "published" ? { status: "draft" } : { status: "published" })}>{r.status === "published" ? "Dépublier" : "Publier"}</button>}
                <button className="btn" onClick={() => setEditing(r)}>Modifier</button>
                <button className="btn text-red-700" onClick={() => remove(r)}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
