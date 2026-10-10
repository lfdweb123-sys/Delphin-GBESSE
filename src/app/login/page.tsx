"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    try { await signInWithEmailAndPassword(auth, email, pw); router.replace("/admin"); }
    catch { setErr("Identifiants incorrects."); } finally { setBusy(false); }
  }
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-soft p-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4 p-6">
        <h1 className="font-serif text-2xl font-semibold">Connexion</h1>
        <label className="block text-sm">Adresse e-mail<input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 h-11 w-full rounded-lg border border-line px-3" /></label>
        <label className="block text-sm">Mot de passe<input type="password" required autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1 h-11 w-full rounded-lg border border-line px-3" /></label>
        {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>{busy ? "Connexion…" : "Se connecter"}</button>
      </form>
    </div>
  );
}
