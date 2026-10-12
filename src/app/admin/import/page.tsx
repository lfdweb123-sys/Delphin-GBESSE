"use client";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { SEED_GALLERY, SEED_IMAGES, SEED_NEWS, SEED_ORGANIZATIONS, SEED_SERVICES, SEED_TIMELINE, type SeedDoc } from "@/lib/seed-data";

const imageId = (key: string) => `seed${key.replace(/[^A-Za-z0-9]/g, "")}`;
const toBase64 = (b: Blob): Promise<string> =>
  new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = () => rej(new Error("Lecture impossible")); r.readAsDataURL(b); });

const GROUPS: { label: string; col: string; docs: SeedDoc[] }[] = [
  { label: "Services", col: "activities", docs: SEED_SERVICES },
  { label: "Entreprise", col: "organizations", docs: SEED_ORGANIZATIONS },
  { label: "Parcours", col: "timeline", docs: SEED_TIMELINE },
  { label: "Articles", col: "news", docs: SEED_NEWS },
  { label: "Galerie", col: "gallery", docs: SEED_GALLERY },
];

/** Remplace les références « @img:clé » par l'adresse publique /img/<id> de l'image importée. */
const resolve = (data: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(data).map(([k, v]) => [k, typeof v === "string" && v.startsWith("@img:") ? `/img/${imageId(v.slice(5))}` : v]));

export default function ImportPage() {
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const add = (l: string) => setLog((p) => [...p, l]);

  async function run() {
    setBusy(true); setErr(""); setDone(false); setLog([]);
    try {
      const now = new Date().toISOString();
      for (let i = 0; i < SEED_IMAGES.length; i++) {
        const img = SEED_IMAGES[i];
        const r = await fetch(img.file);
        if (!r.ok) throw new Error(`Image introuvable : ${img.file}`);
        const blob = await r.blob();
        const data = await toBase64(blob);
        if (data.length >= 950000) throw new Error(`Image trop lourde : ${img.file}`);
        await setDoc(doc(db, "images", imageId(img.key)), { data, contentType: "image/webp", size: blob.size, folder: "seed", createdAt: now });
        add(`Image ${i + 1}/${SEED_IMAGES.length} : ${img.key}`);
      }
      for (const g of GROUPS) {
        for (const d of g.docs) {
          await setDoc(doc(db, g.col, d.id), { ...resolve(d.data), status: "published", verificationStatus: "verified", createdAt: now, updatedAt: now });
        }
        add(`${g.label} : ${g.docs.length} enregistré(s)`);
      }
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Import impossible.");
    } finally { setBusy(false); }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 font-serif text-3xl font-semibold">Import initial des contenus</h1>
      <p className="mb-4 text-sm text-muted">
        Ce script s’exécute dans votre navigateur (aucune commande). Il enregistre dans Firestore : {SEED_SERVICES.length} services, {SEED_NEWS.length} articles avec leur photo,
        {" "}{SEED_GALLERY.length} photos de galerie, l’entreprise GBEDEL et une entrée de parcours. Tout est publié et vérifié, donc visible sur le site (≤ 1 minute).
      </p>
      <p className="mb-6 text-sm text-muted">Relancer l’import met à jour les mêmes éléments (pas de doublons) mais écrase les modifications faites sur eux depuis le dashboard.</p>
      <button type="button" className="btn btn-primary" disabled={busy} onClick={run}>{busy ? "Import en cours…" : done ? "Relancer l’import" : "Lancer l’import"}</button>
      {err && <p role="alert" className="mt-4 text-sm text-red-700">{err}</p>}
      {done && <p role="status" className="mt-4 text-sm font-medium text-green-700">Import terminé. Les contenus sont en ligne.</p>}
      {log.length > 0 && <ul className="mt-4 space-y-1 text-sm text-muted">{log.map((l, i) => <li key={i}>{l}</li>)}</ul>}
    </div>
  );
}
