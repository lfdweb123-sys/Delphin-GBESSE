export const NAV_BASE = [
  { key: "home", href: "/", label: "Accueil" },
  { key: "about", href: "/#a-propos", label: "À propos" },
  { key: "parcours", href: "/parcours", label: "Parcours" },
  { key: "realisations", href: "/realisations", label: "Réalisations" },
  { key: "activites", href: "/activites", label: "Activités" },
  { key: "evenements", href: "/evenements", label: "Événements" },
  { key: "actualites", href: "/actualites", label: "Actualités" },
  { key: "galerie", href: "/galerie", label: "Galerie" },
  { key: "collaboration", href: "/collaboration", label: "Collaboration" },
  { key: "contact", href: "/contact", label: "Contact" },
] as const;
export interface NavItem { key: string; href: string; label: string }
