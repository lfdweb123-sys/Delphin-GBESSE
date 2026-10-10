"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { NavItem } from "@/lib/nav";
import Logo from "./Logo";

interface Props { open: boolean; onClose: () => void; name: string; logoUrl?: string; nav: NavItem[] }

/** Panneau latéral droit : overlay, scroll bloqué, Escape, focus piégé, fermeture à la navigation. */
export default function MobileDrawer({ open, onClose, name, logoUrl, nav }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => { onClose(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>("a[href], button");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; previous?.focus(); };
  }, [open, onClose]);

  return (
    <div className="xl:hidden" aria-hidden={!open}>
      <div onClick={onClose} className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <div id="mobile-drawer" ref={panel} role="dialog" aria-modal="true" aria-label="Menu de navigation"
        className={`fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "invisible translate-x-full"}`}
        style={{ transitionProperty: "transform, visibility" }}>
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Logo logoUrl={logoUrl} name={name} onClick={onClose} />
          <button ref={closeBtn} type="button" onClick={onClose} aria-label="Fermer le menu" className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" /></svg>
          </button>
        </div>
        <nav aria-label="Navigation mobile" className="flex-1 overflow-y-auto px-3 py-4">
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={onClose} className="flex min-h-[52px] items-center rounded-lg px-3 text-lg text-ink hover:bg-soft">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
