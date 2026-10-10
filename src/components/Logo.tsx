import Image from "next/image";
import Link from "next/link";

/** Logo seul s'il existe ; sinon le nom en texte. Jamais les deux. `light` = texte blanc (fond noir). */
export default function Logo({ logoUrl, name, onClick, light = false }: { logoUrl?: string; name: string; onClick?: () => void; light?: boolean }) {
  return (
    <Link href="/" onClick={onClick} aria-label={`${name} — Accueil`} className="inline-flex items-center">
      {logoUrl ? (
        <Image src={logoUrl} alt={name} width={160} height={40} priority className="h-10 w-auto max-w-[160px] object-contain" />
      ) : (
        <span className={`font-serif text-xl font-semibold tracking-tight ${light ? "text-white transition-colors hover:text-gold" : ""}`}>{name}</span>
      )}
    </Link>
  );
}
