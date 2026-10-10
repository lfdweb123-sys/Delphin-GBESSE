"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { NavItem } from "@/lib/nav";
import Logo from "./Logo";
import MobileDrawer from "./MobileDrawer";

export default function Header({ name, logoUrl, nav }: { name: string; logoUrl?: string; nav: NavItem[] }) {
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
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo logoUrl={logoUrl} name={name} />
        <nav aria-label="Navigation principale" className="hidden items-center gap-5 xl:flex">
          {nav.filter((n) => n.key !== "home").map((n) => (
            <Link key={n.key} href={n.href} className="text-sm text-muted transition-colors hover:text-ink">{n.label}</Link>
          ))}
        </nav>
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
