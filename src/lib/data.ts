import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import type { BaseDoc, CollectionName, EventItem, NewsItem, Profile, SiteSettings } from "@/types";
import { DEFAULTS, mergeTexts, type Texts } from "./texts";
export { formatDate, slugify } from "./format";

/**
 * Lecture publique : uniquement les documents publiés ET vérifiés.
 * Les règles Firestore appliquent la même contrainte côté serveur.
 * Le tri se fait en mémoire pour éviter les index composites.
 */
export async function getPublic<T extends BaseDoc>(name: CollectionName): Promise<T[]> {
  if (!isFirebaseConfigured) return [];
  try {
    const q = query(collection(db, name), where("status", "==", "published"), where("verificationStatus", "==", "verified"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...(d.data() as object), id: d.id }) as T);
  } catch (e) {
    console.error(`[data] lecture de ${name} impossible`, e);
    return [];
  }
}

async function getSingle<T extends BaseDoc>(col: "profile" | "settings"): Promise<T | null> {
  if (!isFirebaseConfigured) return null;
  try {
    const s = await getDoc(doc(db, col, "main"));
    if (!s.exists()) return null;
    const d = s.data() as BaseDoc;
    return d.status === "published" && d.verificationStatus === "verified" ? ({ ...d, id: s.id } as T) : null;
  } catch (e) {
    console.error(`[data] lecture de ${col} impossible`, e);
    return null;
  }
}
export const getProfile = () => getSingle<Profile>("profile");
export const getSettings = () => getSingle<SiteSettings>("settings");

/** Tous les textes/bannières du site (settings/texts) fusionnés avec les valeurs par défaut. */
export async function getTexts(): Promise<Texts> {
  if (!isFirebaseConfigured) return DEFAULTS;
  try {
    const s = await getDoc(doc(db, "settings", "texts"));
    const d = s.exists() ? (s.data() as BaseDoc) : null;
    return mergeTexts(d && d.status === "published" && d.verificationStatus === "verified" ? d : null);
  } catch (e) { console.error("[data] lecture des textes impossible", e); return DEFAULTS; }
}

export const byDateDesc = <T extends { date?: string }>(a: T, b: T) => (b.date ?? "").localeCompare(a.date ?? "");
export const byDateAsc = <T extends { date?: string }>(a: T, b: T) => (a.date ?? "").localeCompare(b.date ?? "");

export type EventPhase = "upcoming" | "current" | "past";
export function eventPhase(e: EventItem, now = new Date()): EventPhase {
  const today = now.toISOString().slice(0, 10);
  const end = e.endDate || e.date;
  if (e.date > today) return "upcoming";
  return end >= today ? "current" : "past";
}

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const all = await getPublic<NewsItem>("news");
  return all.find((n) => n.slug === slug) ?? null;
}
