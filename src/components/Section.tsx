import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function Section({ id, title, intro, children, tone = "white" }: { id?: string; title: string; intro?: string; children: ReactNode; tone?: "white" | "soft" }) {
  return (
    <section id={id} className={`${tone === "soft" ? "bg-soft" : ""} py-16 sm:py-20`}>
      <div className="container-x">
        <Reveal>
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          {intro && <p className="mt-3 max-w-2xl whitespace-pre-line leading-7 text-muted">{intro}</p>}
          <div className="mt-10">{children}</div>
        </Reveal>
      </div>
    </section>
  );
}
