"use client";
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { REVIEWABLE } from "@/lib/admin-config";
import { db } from "@/lib/firebase";

interface Item { id: string; col: string; slug: string; label: string; title: string; sourceName?: string; sourceUrl?: string }

export default function Review() {
  const [items, setItems] = useState<Item[]>([]); const [loading, setLoading] = useState(true); const [err, setErr] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await Promise.all(REVIEWABLE.map(async (s) => {
        const snap = await getDocs(query(collection(db, s.collection), where("verificationStatus", "==", "needs_review")));
        return snap.docs.filter((d) => !d.data().rejected).map((d) => ({ id: d.id, col: s.collection, slug: s.slug, label: s.label, title: String(d.data()[s.titleKey] || "(sans titre)"), sourceName: d.data().sourceName, sourceUrl: d.data().sourceUrl }));
      }));
      setItems(all.flat());
    } catch { setErr("Lecture impossible."); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);
  const act = async (i: Item, p: Record<string, unknown>) => { await updateDoc(doc(db, i.col, i.id), { ...p, updatedAt: new Date().toISOString() }); await load(); };

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 font-serif text-3xl font-semibold">Informations à vérifier</h1>
      <p className="mb-6 text-sm text-muted">Ces éléments ne sont pas visibles publiquement tant que vous ne les avez pas validés et publiés.</p>
      {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
      {loading ? <p className="text-sm text-muted">Chargement…</p> : items.length === 0 ? <p className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">Rien à vérifier pour le moment.</p> : (
        <ul className="space-y-3">
          {items.map((i) => (
            <li key={`${i.col}/${i.id}`} className="card space-y-3 p-4">
              <div><p className="text-xs text-muted">{i.label}</p><p className="font-medium">{i.title}</p>
                {i.sourceUrl && <a href={i.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">{i.sourceName || i.sourceUrl}</a>}</div>
              <div className="flex flex-wrap gap-2">
                <button className="btn" onClick={() => act(i, { verificationStatus: "verified" })}>Valider</button>
                <button className="btn btn-primary" onClick={() => act(i, { verificationStatus: "verified", status: "published" })}>Valider et publier</button>
                <Link className="btn" href={`/admin/${i.slug}?edit=${i.id}`}>Modifier</Link>
                <button className="btn" onClick={() => act(i, { rejected: true, status: "draft" })}>Rejeter</button>
                <button className="btn text-red-700" onClick={async () => { if (confirm("Supprimer définitivement ?")) { await deleteDoc(doc(db, i.col, i.id)); await load(); } }}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
