export const NAV_BASE = [
  { key: "home", href: "/", label: "Accueil" },
  { key: "about", href: "/#a-propos", label: "À propos" },
  { key: "parcours", href: "/parcours", label: "Parcours" },
  { key: "realisations", href: "/realisations", label: "Réalisations" },
  { key: "services", href: "/services", label: "Services" },
  { key: "evenements", href: "/evenements", label: "Événements" },
  { key: "actualites", href: "/actualites", label: "Actualités" },
  { key: "galerie", href: "/galerie", label: "Galerie" },
  { key: "collaboration", href: "/collaboration", label: "Collaboration" },
  { key: "contact", href: "/contact", label: "Contact" },
] as const;
export interface NavItem { key: string; href: string; label: string }

/** Vrai si `href` correspond à la page courante (ou à l'une de ses sous-pages, ex. /actualites/mon-article). */
export const isActive = (pathname: string | null, href: string) =>
  !!pathname && (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
