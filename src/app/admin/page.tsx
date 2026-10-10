"use client";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { REVIEWABLE } from "@/lib/admin-config";
import { db } from "@/lib/firebase";

const STATS = [
  { label: "Événements", col: "events" }, { label: "Réalisations", col: "achievements" }, { label: "Articles", col: "news" },
  { label: "Projets", col: "projects" }, { label: "Photos", col: "gallery" }, { label: "Sources", col: "sources" },
];

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({}); const [review, setReview] = useState(0); const [err, setErr] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const c: Record<string, number> = {};
        await Promise.all(STATS.map(async (s) => { c[s.col] = (await getCountFromServer(collection(db, s.col))).data().count; }));
        setCounts(c);
        const r = await Promise.all(REVIEWABLE.map((s) => getCountFromServer(query(collection(db, s.collection), where("verificationStatus", "==", "needs_review")))));
        setReview(r.reduce((a, x) => a + x.data().count, 0));
      } catch { setErr("Statistiques indisponibles."); }
    })();
  }, []);
  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 font-serif text-3xl font-semibold">Dashboard</h1>
      {err && <p role="alert" className="mb-4 text-sm text-red-700">{err}</p>}
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {STATS.map((s) => <div key={s.col} className="card p-5"><dt className="text-sm text-muted">{s.label}</dt><dd className="mt-1 text-3xl font-semibold">{counts[s.col] ?? "–"}</dd></div>)}
        <Link href="/admin/review" className="card p-5 hover:border-ink"><dt className="text-sm text-muted">Informations à vérifier</dt><dd className="mt-1 text-3xl font-semibold">{review}</dd></Link>
      </dl>
    </div>
  );
}
