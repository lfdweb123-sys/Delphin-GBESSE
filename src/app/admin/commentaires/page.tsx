"use client";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { db } from "@/lib/firebase";

interface C { id: string; newsId: string; author: string; text: string; status: string; createdAt: string }

export default function CommentsAdmin() {
  const [items, setItems] = useState<C[]>([]); const [tab, setTab] = useState<"pending" | "published">("pending");
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      const snap = await getDocs(collection(db, "comments"));
      setItems(snap.docs.map((d) => ({ ...(d.data() as Omit<C, "id">), id: d.id })).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setErr("");
    } catch { setErr("Lecture impossible : vérifiez que les règles Firestore du dépôt (commentaires) sont publiées."); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);
  const setStatus = async (c: C, status: string) => { await updateDoc(doc(db, "comments", c.id), { status }); load(); };
  const remove = async (c: C) => { if (confirm("Supprimer définitivement ce commentaire ?")) { await deleteDoc(doc(db, "comments", c.id)); load(); } };
  const shown = items.filter((c) => c.status === tab);
  const pending = items.filter((c) => c.status === "pending").length;
  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 font-serif text-3xl font-semibold">Commentaires</h1>
      <p className="mb-6 text-sm text-muted">Les commentaires des visiteurs n’apparaissent sur le site qu’après votre validation.</p>
      <div className="mb-5 flex gap-2" role="tablist">
        {([["pending", `À valider (${pending})`], ["published", "Publiés"]] as const).map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`btn ${tab === k ? "btn-primary" : ""}`}>{l}</button>
        ))}
      </div>
      {err && <p role="alert" className="mb-4 text-sm text-red-700">{err}</p>}
      {loading ? <p className="text-sm text-muted">Chargement…</p> : shown.length === 0 ? <p className="text-sm text-muted">Aucun commentaire.</p> : (
        <ul className="space-y-4">
          {shown.map((c) => (
            <li key={c.id} className="card p-4 sm:p-5">
              <p className="text-sm"><strong>{c.author}</strong> <span className="text-muted">— {new Date(c.createdAt).toLocaleString("fr-FR")}</span></p>
              <p className="mt-1 text-xs text-muted">Article : <Link href={`/actualites/${c.newsId}`} target="_blank" className="underline">{c.newsId}</Link></p>
              <p className="mt-3 whitespace-pre-line leading-7">{c.text}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.status === "pending"
                  ? <button type="button" className="btn btn-primary" onClick={() => setStatus(c, "published")}>Publier</button>
                  : <button type="button" className="btn" onClick={() => setStatus(c, "pending")}>Masquer</button>}
                <button type="button" className="btn text-red-700" onClick={() => remove(c)}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
