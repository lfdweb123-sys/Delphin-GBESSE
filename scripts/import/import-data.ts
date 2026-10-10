/**
 * Import de données préparées dans Firestore.
 *   npm run import:dry   -> validation seule, rien n'est écrit
 *   npm run import       -> écriture
 * Options : --file=chemin.json
 * Ne crée jamais de donnée : ne fait que lire le JSON fourni.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const file = resolve(args.find((a) => a.startsWith("--file="))?.slice(7) ?? "scripts/import/initial-data.json");

const COLLECTIONS: Record<string, { key: string; required: string[] }> = {
  timeline: { key: "title", required: ["title", "date"] },
  events: { key: "title", required: ["title", "date"] },
  activities: { key: "title", required: ["title"] },
  achievements: { key: "title", required: ["title"] },
  projects: { key: "title", required: ["title"] },
  organizations: { key: "name", required: ["name"] },
  news: { key: "title", required: ["title", "date", "content"] },
  gallery: { key: "alt", required: ["image", "alt"] },
  socialLinks: { key: "network", required: ["network", "url"] },
};
const SOURCE_TYPES = ["presse", "institution", "document_officiel", "réseau_social", "site_web", "vidéo", "autre"];
const STATUSES = ["verified", "needs_review"];

type Obj = Record<string, any>;
const report: { dryRun: boolean; created: string[]; skippedDuplicates: string[]; errors: string[]; sources: number } =
  { dryRun: DRY, created: [], skippedDuplicates: [], errors: [], sources: 0 };

const norm = (s: unknown) => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
const hash = (s: string) => createHash("sha1").update(s).digest("hex").slice(0, 20);
const isUrl = (s: unknown) => typeof s === "string" && /^https?:\/\//.test(s);
const slugify = (s: string) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function validate(col: string, item: Obj, i: number): string[] {
  const errs: string[] = []; const where = `${col}[${i}]`; const spec = COLLECTIONS[col];
  for (const r of spec.required) if (!item[r] || !String(item[r]).trim()) errs.push(`${where}: champ obligatoire manquant « ${r} »`);
  if (!STATUSES.includes(item.verificationStatus)) errs.push(`${where}: verificationStatus doit être verified | needs_review`);
  if (item.verificationStatus === "verified" && !item.source) errs.push(`${where}: une information « verified » doit avoir une source`);
  if (item.source) {
    if (!item.source.name) errs.push(`${where}: source.name manquant`);
    if (!isUrl(item.source.url)) errs.push(`${where}: source.url invalide`);
    if (item.source.type && !SOURCE_TYPES.includes(item.source.type)) errs.push(`${where}: source.type inconnu`);
  }
  for (const k of ["url", "website", "image", "logo"]) if (item[k] && !isUrl(item[k])) errs.push(`${where}: ${k} n'est pas une URL http(s)`);
  if (item.date && !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) errs.push(`${where}: date attendue au format AAAA-MM-JJ`);
  return errs;
}

async function main() {
  const json: Obj = JSON.parse(readFileSync(file, "utf8"));
  if (!getApps().length) initializeApp({ credential: applicationDefault() });
  const db = getFirestore();
  const now = new Date().toISOString();
  let canRead = true;

  // 1. Profil (document unique)
  if (json.profile) {
    const p = json.profile;
    if (!p.name) report.errors.push("profile: name manquant");
    else if (!DRY) await db.doc("profile/main").set({ ...p, updatedAt: now }, { merge: true });
    if (p.name) report.created.push("profile/main");
  }

  // 2. Collections
  for (const [col, spec] of Object.entries(COLLECTIONS)) {
    const items: Obj[] = json[col] ?? [];
    if (!items.length) continue;
    let existing = new Set<string>();
    try {
      const snap = await db.collection(col).get();
      existing = new Set(snap.docs.map((d) => `${norm(d.get(spec.key))}|${d.get("date") ?? ""}`));
    } catch (e) { canRead = false; report.errors.push(`${col}: lecture des doublons impossible (${(e as Error).message})`); }
    const seen = new Set<string>();

    for (const [i, raw] of items.entries()) {
      const errs = validate(col, raw, i);
      if (errs.length) { report.errors.push(...errs); continue; }
      const dupKey = `${norm(raw[spec.key])}|${raw.date ?? ""}`;
      if (seen.has(dupKey) || existing.has(dupKey)) { report.skippedDuplicates.push(`${col}: ${raw[spec.key]}`); continue; }
      seen.add(dupKey);

      const { source, ...data } = raw;
      // Garde-fou : une info à vérifier n'est jamais publiée automatiquement.
      const status = data.verificationStatus === "needs_review" ? "draft" : data.status === "published" ? "published" : "draft";
      const docData: Obj = { ...data, status, createdAt: now, updatedAt: now };
      if (col === "news" && !docData.slug) docData.slug = slugify(docData.title);
      if (source) { docData.sourceName = source.name; docData.sourceUrl = source.url; }

      const id = hash(`${col}|${dupKey}`);
      if (!DRY) {
        await db.collection(col).doc(id).set(docData);
        if (source) {
          const sid = hash(`${source.url}|${source.name}`);
          await db.collection("sources").doc(sid).set({
            name: source.name, url: source.url, type: source.type ?? "autre", publishedAt: source.publishedAt ?? "",
            collectedAt: source.collectedAt ?? now.slice(0, 10), verificationStatus: data.verificationStatus,
          }, { merge: true });
        }
      }
      if (source) report.sources++;
      report.created.push(`${col}/${id} — ${raw[spec.key]}`);
    }
  }

  const out = resolve(`scripts/import/report-${now.replace(/[:.]/g, "-")}.json`);
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(`${DRY ? "[DRY-RUN] " : ""}Créés : ${report.created.length} · Doublons ignorés : ${report.skippedDuplicates.length} · Erreurs : ${report.errors.length}`);
  if (report.errors.length) console.log("Erreurs :\n - " + report.errors.join("\n - "));
  if (!canRead) console.log("Note : détection des doublons incomplète (pas d'accès en lecture à Firestore).");
  console.log(`Rapport : ${out}`);
  process.exit(report.errors.length ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
