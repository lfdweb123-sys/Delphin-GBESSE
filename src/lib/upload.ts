import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_INPUT = 15 * 1024 * 1024;
/** Un document Firestore est limité à 1 Mio ; le base64 ajoute ~33 % : on vise 600 Ko binaires maximum. */
const TARGET_BYTES = 600 * 1024;

const toBlob = (c: HTMLCanvasElement, q: number): Promise<Blob> =>
  new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("Conversion impossible"))), "image/webp", q));
const toBase64 = (b: Blob): Promise<string> =>
  new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = () => rej(new Error("Lecture impossible")); r.readAsDataURL(b); });

/**
 * Valide, redimensionne, compresse en WebP (< 600 Ko) et enregistre dans Firestore (collection `images`).
 * Retourne l'adresse publique `/img/<id>`. Aucune utilisation de Firebase Storage.
 */
export async function optimizeAndUpload(file: File, folder: string, maxSide = 1600): Promise<string> {
  if (!ALLOWED.includes(file.type)) throw new Error("Format refusé : utilisez JPEG, PNG ou WebP.");
  if (file.size > MAX_INPUT) throw new Error("Fichier trop lourd (15 Mo maximum).");
  const bmp = await createImageBitmap(file);
  let side = maxSide; let quality = 0.82; let blob: Blob | null = null;
  for (let i = 0; i < 12; i++) {
    const scale = Math.min(1, side / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(bmp.width * scale)); c.height = Math.max(1, Math.round(bmp.height * scale));
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    blob = await toBlob(c, quality);
    if (blob.size <= TARGET_BYTES) break;
    if (quality > 0.55) quality -= 0.1; else side = Math.round(side * 0.8);
  }
  if (!blob || blob.size > TARGET_BYTES) throw new Error("Impossible de réduire assez cette image. Essayez une image plus petite.");
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  await setDoc(doc(db, "images", id), { data: await toBase64(blob), contentType: "image/webp", size: blob.size, folder, createdAt: new Date().toISOString() });
  return `/img/${id}`;
}

export async function removeImage(url: string) {
  const m = /^\/img\/([A-Za-z0-9]+)$/.exec(url);
  if (!m) return;
  try { await deleteDoc(doc(db, "images", m[1])); } catch (e) { console.warn("Suppression de l'image impossible", e); }
}
