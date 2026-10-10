import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_INPUT = 10 * 1024 * 1024;

/** Valide, redimensionne (canvas) et convertit en WebP avant l'envoi. */
export async function optimizeAndUpload(file: File, folder: string, maxSide = 1600): Promise<string> {
  if (!ALLOWED.includes(file.type)) throw new Error("Format refusé : utilisez JPEG, PNG ou WebP.");
  if (file.size > MAX_INPUT) throw new Error("Fichier trop lourd (10 Mo maximum).");
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale); canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const blob: Blob = await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("Conversion impossible"))), "image/webp", 0.82));
  const path = `uploads/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  await uploadBytes(ref(storage, path), blob, { contentType: "image/webp" });
  return getDownloadURL(ref(storage, path));
}

export async function removeImage(url: string) {
  try { await deleteObject(ref(storage, url)); } catch (e) { console.warn("Suppression du fichier impossible", e); }
}
