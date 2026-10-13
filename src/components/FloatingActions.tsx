"use client";
import { useEffect, useState } from "react";

/** Accueil : bouton WhatsApp en bas à droite, retour en haut en bas à gauche (visible après défilement). Le numéro n'est jamais affiché. */
export default function FloatingActions({ whatsapp }: { whatsapp?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 400);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const digits = (whatsapp ?? "").replace(/[^\d]/g, "");
  const pos = { bottom: "max(1.25rem, env(safe-area-inset-bottom))" };
  return (
    <>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Retour en haut de la page"
        tabIndex={show ? 0 : -1}
        style={pos}
        className={`fixed left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-black text-gold shadow-lg ring-1 ring-gold/40 transition-all duration-300 hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:left-6 ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
      </button>
      {digits && (
        <a
          href={`https://wa.me/${digits}?text=${encodeURIComponent("Bonjour, je vous contacte depuis votre site.")}`}
          target="_blank" rel="noopener noreferrer" aria-label="Discuter sur WhatsApp" style={pos}
          className="fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:right-6"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /><path d="M9 9.5c0 3 2.500 5.500 5.500 5.500l1.200-1.500-1.800-1-.8.700a3.500 3.500 0 0 1-1.500-1.500l.7-.8-1-1.800L9 9.500z" /></svg>
        </a>
      )}
    </>
  );
}
