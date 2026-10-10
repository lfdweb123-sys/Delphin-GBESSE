"use client";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth, db } from "@/lib/firebase";

const Ctx = createContext<User | null>(null);
export const useAdmin = () => useContext(Ctx);

/** Accès réservé aux comptes présents dans /adminUsers/{uid}. La vraie protection reste dans les règles Firestore. */
export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");
  useEffect(() => onAuthStateChanged(auth, async (u) => {
    if (!u) { router.replace("/login"); return; }
    try {
      const snap = await getDoc(doc(db, "adminUsers", u.uid));
      if (snap.exists()) { setUser(u); setState("ok"); } else setState("denied");
    } catch { setState("denied"); }
  }), [router]);
  if (state === "loading") return <p className="p-8 text-sm text-muted">Chargement…</p>;
  if (state === "denied") return (
    <div className="mx-auto max-w-md p-8 text-center">
      <h1 className="text-xl font-semibold">Accès refusé</h1>
      <p className="mt-2 text-sm text-muted">Ce compte n’est pas administrateur.</p>
      <button className="btn mt-6" onClick={() => signOut(auth).then(() => router.replace("/login"))}>Se déconnecter</button>
    </div>
  );
  return <Ctx.Provider value={user}>{children}</Ctx.Provider>;
}
