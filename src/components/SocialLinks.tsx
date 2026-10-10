import type { SocialLink } from "@/types";

export default function SocialLinks({ links, dark = false }: { links: SocialLink[]; dark?: boolean }) {
  if (!links.length) return null;
  const cls = dark
    ? "inline-flex min-h-[44px] items-center rounded-lg border border-white/25 px-4 text-sm text-white/90 transition-colors duration-200 hover:border-gold hover:text-gold focus-visible:outline-gold"
    : "btn";
  return (
    <ul className="flex flex-wrap gap-3" aria-label="Réseaux sociaux officiels">
      {links.map((l) => (
        <li key={l.id}>
          <a href={l.url} target="_blank" rel="noopener noreferrer" className={cls}>{l.network}</a>
        </li>
      ))}
    </ul>
  );
}
