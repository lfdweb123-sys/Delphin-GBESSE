"use client";
import { useEffect, useRef, useState } from "react";
import { useT } from "./TextsProvider";

const CLAMP = { 2: "line-clamp-2", 3: "line-clamp-3", 4: "line-clamp-4", 5: "line-clamp-5", 6: "line-clamp-6" } as const;

/** Texte tronqué avec bouton « Lire plus / Voir moins », affiché seulement si le texte est réellement coupé. */
export default function ExpandableText({ text, lines = 4, className = "" }: { text: string; lines?: 2 | 3 | 4 | 5 | 6; className?: string }) {
  const t = useT();
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => { if (!open) setClamped(el.scrollHeight - el.clientHeight > 1); };
    check();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, open]);

  return (
    <div>
      <p ref={ref} className={`whitespace-pre-line ${open ? "" : CLAMP[lines]} ${className}`}>{text}</p>
      {(clamped || open) && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          {open ? t.label_read_less : t.label_read_more}
        </button>
      )}
    </div>
  );
}
