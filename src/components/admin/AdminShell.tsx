"use client";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { SECTIONS } from "@/lib/admin-config";
import { useAdmin } from "./AuthGuard";

interface Item { href: string; label: string; icon: ReactNode }
interface Group { title: string; items: Item[] }

const I = ({ d }: { d: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const ICONS: Record<string, string> = {
  dashboard: "M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zM13 3v6h8V3h-8z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  text: "M4 6h16M4 12h16M4 18h10",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  box: "M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8",
  news: "M4 5h13v14H6a2 2 0 0 1-2-2V5zM17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5",
  image: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9h.01",
  link: "M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1",
  building: "M4 21V5l8-2v18M12 9h8v12M8 8h.01M8 12h.01M8 16h.01M16 13h.01M16 17h.01",
  msg: "M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.6A8 8 0 1 1 21 12z",
  check: "M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  file: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6zM14 3v6h6",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  cog: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2L10 21h4l.6-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z",
};
const ICON_BY_SLUG: Record<string, string> = {
  profil: "user", "textes-accueil": "text", "textes-pages": "text", "textes-menu": "text", parcours: "list", services: "box", materiels: "box",
  organisations: "building", actualites: "news", galerie: "image", reseaux: "link",
};
const SHORT: Record<string, string> = {
  "textes-accueil": "Accueil (textes, bannières)", "textes-pages": "Pages (titres, bannières)", "textes-menu": "Menu et pied de page", organisations: "Entreprises",
};
const section = (slug: string): Item => {
  const s = SECTIONS.find((x) => x.slug === slug)!;
  return { href: `/admin/${slug}`, label: SHORT[slug] ?? s.label, icon: <I d={ICONS[ICON_BY_SLUG[slug] ?? "file"]} /> };
};

const GROUPS: Group[] = [
  { title: "Général", items: [{ href: "/admin", label: "Dashboard", icon: <I d={ICONS.dashboard} /> }] },
  { title: "Contenu", items: ["profil", "textes-accueil", "textes-pages", "textes-menu", "parcours", "services", "materiels", "organisations", "actualites", "galerie", "reseaux"].filter((s) => SECTIONS.some((x) => x.slug === s)).map(section) },
  { title: "Modération", items: [
    { href: "/admin/commentaires", label: "Commentaires", icon: <I d={ICONS.msg} /> },
    { href: "/admin/review", label: "Informations à vérifier", icon: <I d={ICONS.check} /> },
  ] },
  { title: "Outils", items: [
    { href: "/admin/sources", label: "Sources", icon: <I d={ICONS.file} /> },
    { href: "/admin/import", label: "Import initial", icon: <I d={ICONS.upload} /> },
    { href: "/admin/parametres", label: "Paramètres", icon: <I d={ICONS.cog} /> },
  ] },
];
const ALL = GROUPS.flatMap((g) => g.items);

export default function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname(); const router = useRouter(); const user = useAdmin();
  const [open, setOpen] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", k);
    const o = document.body.style.overflow; document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = o; };
  }, [open, close]);

  const active = (href: string) => (href === "/admin" ? path === "/admin" : path === href || path.startsWith(`${href}/`));
  const current = ALL.find((i) => active(i.href))?.label ?? "Administration";

  return (
    <div className="fixed inset-0 z-[60] bg-soft lg:flex">
      {open && <div className="fixed inset-0 z-[70] bg-black/60 lg:hidden" onClick={close} aria-hidden="true" />}
      <aside
        id="admin-sidebar"
        aria-label="Menu d’administration"
        className={`fixed inset-y-0 left-0 z-[80] flex w-[85%] max-w-xs flex-col bg-black text-white shadow-2xl transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-72 lg:max-w-none lg:translate-x-0 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link href="/admin" className="flex items-center gap-2 font-serif text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gold text-sm font-bold text-black" aria-hidden="true">A</span>Administration
          </Link>
          <button ref={closeBtn} type="button" onClick={close} aria-label="Fermer le menu" className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 lg:hidden">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" /></svg>
          </button>
        </div>
        <nav aria-label="Administration" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <p className="px-3 text-[11px] font-semibold uppercase tracking-widest text-white/40">{g.title}</p>
              <ul className="mt-2 space-y-0.5">
                {g.items.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} aria-current={active(l.href) ? "page" : undefined}
                      className={`relative flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${active(l.href) ? "bg-white/10 font-semibold text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
                      {active(l.href) && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-gold" aria-hidden="true" />}
                      <span className={active(l.href) ? "text-gold" : "text-white/50"}>{l.icon}</span>
                      <span className="truncate">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="shrink-0 border-t border-white/10 p-4">
          {user?.email && <p className="mb-3 truncate text-xs text-white/50" title={user.email}>{user.email}</p>}
          <div className="grid grid-cols-2 gap-2">
            <Link href="/" className="flex min-h-[44px] items-center justify-center rounded-lg border border-white/15 text-sm text-white/80 hover:bg-white/10">Voir le site</Link>
            <button type="button" onClick={() => signOut(auth).then(() => router.replace("/login"))} className="min-h-[44px] rounded-lg border border-white/15 text-sm text-white/80 hover:bg-white/10">Déconnexion</button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:h-full">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-white px-3 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Ouvrir le menu d’administration" aria-expanded={open} aria-controls="admin-sidebar"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" /></svg>
          </button>
          <p className="min-w-0 flex-1 truncate font-semibold">{current}</p>
          <Link href="/" className="text-sm text-muted hover:text-ink">Site</Link>
        </header>
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
