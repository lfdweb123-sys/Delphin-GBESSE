"use client";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { GENERIC_DOCS, PROFILE_UPDATE, SEED_GALLERY, SEED_IMAGES, SEED_MATERIELS, SEED_NEWS, SEED_ORGANIZATIONS, SEED_SERVICES, SEED_TIMELINE, TEXTS_UPDATE, type SeedDoc } from "@/lib/seed-data";

const imageId = (key: string) => `seed${key.replace(/[^A-Za-z0-9]/g, "")}`;
const norm = (v: unknown) => String(v ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const slugify = (v: string) => norm(v).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const toBase64 = (b: Blob): Promise<string> =>
  new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = () => rej(new Error("Lecture impossible")); r.readAsDataURL(b); });

const GROUPS: { label: string; col: string; docs: SeedDoc[]; merge?: boolean }[] = [
  // Services : fusion, pour conserver les images déjà mises en place depuis le dashboard.
  { label: "Services", col: "activities", docs: SEED_SERVICES, merge: true },
  { label: "Matériels", col: "achievements", docs: SEED_MATERIELS, merge: true },
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
  const [clean, setClean] = useState(true);
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
          await setDoc(doc(db, g.col, d.id), { ...resolve(d.data), status: "published", verificationStatus: "verified", createdAt: now, updatedAt: now }, { merge: !!g.merge });
        }
        add(`${g.label} : ${g.docs.length} enregistré(s)`);
      }
      // Événements → Actualités (la rubrique « Événements » n'existe plus dans le menu).
      const evSnap = await getDocs(collection(db, "events"));
      let moved = 0;
      for (const e of evSnap.docs) {
        const v = e.data();
        const title = String(v.title ?? "").trim();
        if (!title || v.status !== "published") continue;
        const slug = `evenement-${slugify(title)}`.slice(0, 80);
        const parts = [v.description, v.location && `Lieu : ${v.location}`, v.time && `Heure : ${v.time}`, v.participants && `Participants : ${v.participants}`].filter(Boolean);
        await setDoc(doc(db, "news", slug), {
          slug, title, content: parts.join("\n\n"), date: v.date, category: "Événement", image: v.image || "",
          ...(v.url ? { sourceUrl: v.url } : {}), status: "published", verificationStatus: "verified", createdAt: now, updatedAt: now,
        });
        moved++;
      }
      add(`Événements ajoutés aux actualités : ${moved}`);
      // Profil et textes d'accueil : uniquement la personne (l'entreprise est dans « Services » et « Organisations »).
      const flags = { status: "published", verificationStatus: "verified", updatedAt: now };
      await setDoc(doc(db, "profile", "main"), { ...PROFILE_UPDATE, ...flags }, { merge: true });
      await setDoc(doc(db, "settings", "texts"), { ...TEXTS_UPDATE, ...flags }, { merge: true });
      add("Profil et texte d’accueil mis à jour (personne uniquement)");
      if (clean) {
        let g = 0;
        for (const x of GENERIC_DOCS) {
          const keepIds = new Set(GROUPS.filter((gr) => gr.col === x.col).flatMap((gr) => gr.docs.map((d) => d.id)));
          const s2 = await getDocs(collection(db, x.col));
          for (const d of s2.docs) {
            if (keepIds.has(d.id)) continue;
            const v = norm(d.data()[x.field]);
            if (x.starts.some((st) => v.startsWith(norm(st)))) { await deleteDoc(d.ref); g++; }
          }
        }
        add(`Contenus génériques supprimés : ${g}`);
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
        Ce script s’exécute dans votre navigateur (aucune commande). Il ajoute aussi les événements existants aux actualités. Il enregistre dans Firestore : {SEED_SERVICES.length} services, {SEED_MATERIELS.length} matériels, {SEED_NEWS.length} articles avec leur photo,
        {" "}{SEED_GALLERY.length} photos de galerie, l’entreprise GBEDEL et une entrée de parcours. Le profil et le texte d’accueil sont réécrits pour ne parler que de la personne (l’entreprise reste dans « Services » et « Organisations »). Tout est publié et vérifié, donc visible sur le site (≤ 1 minute).
      </p>
      <p className="mb-6 text-sm text-muted">Relancer l’import met à jour les mêmes éléments (pas de doublons) mais écrase les modifications faites sur eux depuis le dashboard.</p>
      <label className="mb-5 flex items-start gap-2 text-sm">
        <input type="checkbox" className="mt-1" checked={clean} onChange={(e) => setClean(e.target.checked)} />
        <span>Nettoyer : supprimer les contenus génériques qui mélangent la personne et l’entreprise (service « Activités professionnelles », actualité « un engagement en faveur du développement », parcours « un parcours d’entrepreneur », réalisation « Réalisations et contributions », organisation « Entreprises et organisations de Delphin Gbesse »). Vos autres contenus et vos images de services ne sont pas touchés.</span>
      </label>
      <button type="button" className="btn btn-primary" disabled={busy} onClick={run}>{busy ? "Import en cours…" : done ? "Relancer l’import" : "Lancer l’import"}</button>
      {err && <p role="alert" className="mt-4 text-sm text-red-700">{err}</p>}
      {done && <p role="status" className="mt-4 text-sm font-medium text-green-700">Import terminé. Les contenus sont en ligne.</p>}
      {log.length > 0 && <ul className="mt-4 space-y-1 text-sm text-muted">{log.map((l, i) => <li key={i}>{l}</li>)}</ul>}
    </div>
  );
}
