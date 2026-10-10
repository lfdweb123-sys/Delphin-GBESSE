import type { SocialLink } from "@/types";

export default function SocialLinks({ links }: { links: SocialLink[] }) {
  if (!links.length) return null;
  return (
    <ul className="flex flex-wrap gap-3" aria-label="Réseaux sociaux officiels">
      {links.map((l) => (
        <li key={l.id}>
          <a href={l.url} target="_blank" rel="noopener noreferrer" className="btn">{l.network}</a>
        </li>
      ))}
    </ul>
  );
}
