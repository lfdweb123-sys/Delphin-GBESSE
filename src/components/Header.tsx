"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { isActive, type NavItem } from "@/lib/nav";
import Logo from "./Logo";
import MobileDrawer from "./MobileDrawer";

export default function Header({ name, logoUrl, nav }: { name: string; logoUrl?: string; nav: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`sticky top-0 z-40 bg-white transition-shadow ${scrolled ? "border-b border-line shadow-sm" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-[72px] w-full max-w-[88rem] items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 xl:px-8">
        <div className="shrink-0 xl:flex-1"><Logo logoUrl={logoUrl} name={name} size="header" /></div>
        <nav aria-label="Navigation principale" className="hidden items-center justify-center gap-6 xl:flex">
          {nav.filter((n) => n.key !== "home" && n.key !== "contact").map((n) => (
            <Link key={n.key} href={n.href} aria-current={isActive(pathname, n.href) ? "page" : undefined}
              className={`border-b-2 py-1 text-sm transition-colors ${isActive(pathname, n.href) ? "border-gold font-semibold text-ink" : "border-transparent text-muted hover:text-ink"}`}>{n.label}</Link>
          ))}
        </nav>
        <div className="hidden xl:flex xl:flex-1 xl:justify-end">
          {nav.filter((n) => n.key === "contact").map((n) => (
            <Link key={n.key} href={n.href} aria-current={isActive(pathname, n.href) ? "page" : undefined}
              className={`inline-flex min-h-[44px] items-center justify-center rounded-lg bg-black px-6 text-sm font-semibold text-white transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${isActive(pathname, n.href) ? "ring-2 ring-gold ring-offset-2" : ""}`}>{n.label}</Link>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line xl:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M3 6h14M3 10h14M3 14h14" />
          </svg>
        </button>
      </div>
      <MobileDrawer open={open} onClose={close} name={name} logoUrl={logoUrl} nav={nav} />
    </header>
  );
}
