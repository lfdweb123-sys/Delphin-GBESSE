"use client";
import Image from "next/image";
import { useState } from "react";
import { optimizeAndUpload, removeImage } from "@/lib/upload";

export default function ImageField({ value, onChange, folder, maxSide }: { value?: string; onChange: (v: string) => void; folder: string; maxSide?: number }) {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true); setErr("");
    try { const url = await optimizeAndUpload(f, folder, maxSide); if (value) await removeImage(value); onChange(url); }
    catch (x) { setErr(x instanceof Error ? x.message : "Échec de l’envoi."); } finally { setBusy(false); e.target.value = ""; }
  }
  return (
    <div className="space-y-2">
      {value && <Image src={value} alt="Aperçu" width={160} height={160} className="h-32 w-auto max-w-full rounded-lg border border-line object-contain" />}
      <div className="flex flex-wrap items-center gap-2">
        <label className="btn cursor-pointer">{busy ? "Envoi…" : value ? "Remplacer" : "Ajouter"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={pick} disabled={busy} /></label>
        {value && <button type="button" className="btn" onClick={async () => { await removeImage(value); onChange(""); }}>Supprimer</button>}
      </div>
      {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
    </div>
  );
}
