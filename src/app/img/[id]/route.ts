import { doc, getDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

/** Sert une image stockée dans Firestore (images/{id}). L'id change à chaque remplacement : cache longue durée. */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!isFirebaseConfigured || !/^[A-Za-z0-9]+$/.test(params.id)) return new Response("Not found", { status: 404 });
  try {
    const snap = await getDoc(doc(db, "images", params.id));
    const d = snap.data() as { data?: string; contentType?: string } | undefined;
    if (!d?.data) return new Response("Not found", { status: 404 });
    return new Response(Buffer.from(d.data, "base64"), {
      headers: {
        "Content-Type": d.contentType || "image/webp",
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
