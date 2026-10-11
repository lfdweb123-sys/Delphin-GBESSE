import Image from "next/image";
import Link from "next/link";

const SIZES = {
  header: "h-12 max-w-[220px] sm:h-14 sm:max-w-[280px]",
  drawer: "h-11 max-w-[190px]",
  footer: "h-16 max-w-[260px] sm:h-20 sm:max-w-[320px]",
} as const;
const TEXT = { header: "text-2xl", drawer: "text-xl", footer: "text-2xl sm:text-3xl" } as const;

interface Props {
  logoUrl?: string;
  name: string;
  onClick?: () => void;
  /** Texte en blanc (fond noir) quand il n'y a pas de logo. */
  light?: boolean;
  size?: keyof typeof SIZES;
}

/** Logo seul s'il existe ; sinon le nom en texte. Jamais les deux. */
export default function Logo({ logoUrl, name, onClick, light = false, size = "header" }: Props) {
  return (
    <Link href="/" onClick={onClick} aria-label={`${name} — Accueil`} className="inline-flex items-center">
      {logoUrl ? (
        <Image src={logoUrl} alt={name} width={320} height={96} className={`${SIZES[size]} w-auto object-contain`} />
      ) : (
        <span className={`font-serif font-semibold tracking-tight ${TEXT[size]} ${light ? "text-white transition-colors hover:text-gold" : ""}`}>{name}</span>
      )}
    </Link>
  );
}
