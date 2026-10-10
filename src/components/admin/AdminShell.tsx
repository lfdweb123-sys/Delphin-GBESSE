"use client";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { SECTIONS } from "@/lib/admin-config";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  ...SECTIONS.filter((s) => s.slug !== "sources" && s.slug !== "parametres").map((s) => ({ href: `/admin/${s.slug}`, label: s.label })),
  { href: "/admin/sources", label: "Sources" },
  { href: "/admin/review", label: "Informations à vérifier" },
  { href: "/admin/parametres", label: "Paramètres" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const router = useRouter();
  return (
    <div className="fixed inset-0 z-[60] overflow-auto bg-soft lg:flex">
      <aside className="border-b border-line bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-4 py-3 lg:block">
          <Link href="/admin" className="font-serif text-lg font-semibold">Administration</Link>
          <div className="flex gap-3 text-sm lg:mt-1"><Link href="/" className="text-muted hover:text-ink">Voir le site</Link>
            <button className="text-muted hover:text-ink" onClick={() => signOut(auth).then(() => router.replace("/login"))}>Déconnexion</button></div>
        </div>
        <nav aria-label="Administration" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}
              className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm ${path === l.href ? "bg-ink text-white" : "text-muted hover:bg-soft"}`}>{l.label}</Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 p-4 sm:p-8">{children}</div>
    </div>
  );
}
