"use client";
import { addDoc, collection, doc, getDoc, getDocs, increment, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { db } from "@/lib/firebase";
import { formatDate } from "@/lib/format";

interface Comment { id: string; author: string; text: string; createdAt: string }
const btn = "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-line px-4 text-sm font-medium transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

/** J'aime, partage et commentaires (modérés) d'un article. `id` = identifiant (slug) de l'article. */
export default function NewsEngagement({ id, title, path }: { id: string; title: string; path: string }) {
  const [likes, setLikes] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [author, setAuthor] = useState(""); const [text, setText] = useState(""); const [trap, setTrap] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null); const [busy, setBusy] = useState(false);
  const url = () => `${window.location.origin}${path}`;

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && "share" in navigator);
    try { setLiked(localStorage.getItem(`liked:${id}`) === "1"); } catch { /* stockage indisponible */ }
    (async () => {
      try { const s = await getDoc(doc(db, "newsStats", id)); setLikes(s.exists() ? Number(s.data().likes) || 0 : 0); } catch { setLikes(0); }
      try {
        const snap = await getDocs(query(collection(db, "comments"), where("newsId", "==", id), where("status", "==", "published")));
        setComments(snap.docs.map((d) => ({ ...(d.data() as Omit<Comment, "id">), id: d.id })).sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
      } catch { /* commentaires indisponibles */ }
    })();
  }, [id]);

  const toggleLike = useCallback(async () => {
    const next = !liked; const ref = doc(db, "newsStats", id);
    setLiked(next); setLikes((n) => Math.max(0, (n ?? 0) + (next ? 1 : -1)));
    try { localStorage.setItem(`liked:${id}`, next ? "1" : "0"); } catch { /* ignoré */ }
    try {
      try { await updateDoc(ref, { likes: increment(next ? 1 : -1) }); }
      catch (e) { if (next && (e as { code?: string }).code === "not-found") await setDoc(ref, { likes: 1 }); else throw e; }
    } catch { setLiked(!next); setLikes((n) => Math.max(0, (n ?? 0) + (next ? -1 : 1))); }
  }, [id, liked]);

  const share = (kind: "wa" | "fb" | "x" | "native" | "copy") => {
    const u = url(); const e = encodeURIComponent;
    if (kind === "native") { navigator.share({ title, url: u }).catch(() => undefined); return; }
    if (kind === "copy") { navigator.clipboard?.writeText(u).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => undefined); return; }
    const href = kind === "wa" ? `https://wa.me/?text=${e(`${title} ${u}`)}` : kind === "fb" ? `https://www.facebook.com/sharer/sharer.php?u=${e(u)}` : `https://twitter.com/intent/tweet?url=${e(u)}&text=${e(title)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  async function submit(ev: FormEvent) {
    ev.preventDefault(); setMsg(null);
    if (trap) return;
    const a = author.trim(); const t = text.trim();
    if (a.length < 2 || t.length < 2) { setMsg({ ok: false, t: "Renseignez votre nom et votre commentaire." }); return; }
    try { const last = Number(localStorage.getItem("comment:last") || 0); if (Date.now() - last < 30000) { setMsg({ ok: false, t: "Merci de patienter quelques secondes avant un nouveau commentaire." }); return; } } catch { /* ignoré */ }
    setBusy(true);
    try {
      await addDoc(collection(db, "comments"), { newsId: id, author: a.slice(0, 60), text: t.slice(0, 1000), status: "pending", createdAt: new Date().toISOString() });
      try { localStorage.setItem("comment:last", String(Date.now())); } catch { /* ignoré */ }
      setAuthor(""); setText(""); setMsg({ ok: true, t: "Merci ! Votre commentaire sera publié après validation." });
    } catch { setMsg({ ok: false, t: "Envoi impossible pour le moment. Réessayez plus tard." }); }
    finally { setBusy(false); }
  }

  return (
    <section aria-label="Réactions et commentaires" className="mt-12 border-t border-line pt-8">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={toggleLike} aria-pressed={liked} className={`${btn} ${liked ? "border-ink bg-black text-white" : ""}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.500 12 21 12 21z" /></svg>
          J’aime{likes !== null && <span className="tabular-nums">· {likes}</span>}
        </button>
        <span className="text-sm text-muted">Partager :</span>
        {canShare && <button type="button" onClick={() => share("native")} className={btn}>Partager</button>}
        <button type="button" onClick={() => share("wa")} className={btn}>WhatsApp</button>
        <button type="button" onClick={() => share("fb")} className={btn}>Facebook</button>
        <button type="button" onClick={() => share("x")} className={btn}>X</button>
        <button type="button" onClick={() => share("copy")} className={btn} aria-live="polite">{copied ? "Lien copié ✓" : "Copier le lien"}</button>
      </div>

      <h2 className="mt-10 font-serif text-2xl font-semibold">Commentaires{comments.length > 0 && <span className="text-muted"> ({comments.length})</span>}</h2>
      {comments.length === 0 ? <p className="mt-3 text-sm text-muted">Soyez le premier à commenter.</p> : (
        <ul className="mt-5 space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="rounded-xl border border-line bg-white p-4 sm:p-5">
              <p className="text-sm"><strong>{c.author}</strong> <span className="text-muted">— {formatDate(c.createdAt.slice(0, 10))}</span></p>
              <p className="mt-2 whitespace-pre-line leading-7 text-ink/90">{c.text}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl bg-soft p-5 sm:p-6" noValidate>
        <h3 className="font-semibold">Laisser un commentaire</h3>
        <div><label htmlFor="c-author" className="mb-1 block text-sm font-medium">Votre nom</label>
          <input id="c-author" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={60} autoComplete="name" className="min-h-[44px] w-full rounded-lg border border-line bg-white px-3" /></div>
        <div><label htmlFor="c-text" className="mb-1 block text-sm font-medium">Votre commentaire</label>
          <textarea id="c-text" value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} rows={4} className="w-full rounded-lg border border-line bg-white px-3 py-2" /></div>
        <div className="hidden" aria-hidden="true"><label>Ne pas remplir<input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label></div>
        <button type="submit" disabled={busy} className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-black px-6 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60">{busy ? "Envoi…" : "Publier le commentaire"}</button>
        {msg && <p role={msg.ok ? "status" : "alert"} className={`text-sm ${msg.ok ? "text-green-700" : "text-red-700"}`}>{msg.t}</p>}
        <p className="text-xs text-muted">Les commentaires sont modérés avant publication.</p>
      </form>
    </section>
  );
}
