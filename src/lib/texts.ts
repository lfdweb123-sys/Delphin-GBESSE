import { NAV_BASE, type NavItem } from "./nav";

export type TextType = "text" | "textarea" | "image" | "select" | "heading";
export interface TextField { key: string; label: string; type: TextType; def?: string; options?: string[]; help?: string }
export type Texts = Record<string, string>;
const YN = ["Oui", "Non"];

const SECTIONS = [
  { k: "about", title: "À propos" }, { k: "responsibilities", title: "Responsabilités" },
  { k: "timeline", title: "Parcours", more: "Voir tout le parcours" }, { k: "achievements", title: "Réalisations", more: "Toutes les réalisations" },
  { k: "activities", title: "Activités récentes", more: "Toutes les activités" }, { k: "events", title: "Événements", more: "Tous les événements" },
  { k: "projects", title: "Projets" }, { k: "organizations", title: "Organisations" },
  { k: "news", title: "Actualités", more: "Toutes les actualités" }, { k: "gallery", title: "Galerie", more: "Voir la galerie" },
  { k: "socials", title: "Réseaux sociaux" },
  { k: "collaboration", title: "Collaboration", intro: "Entreprises, organisations, institutions, médias et partenaires : prenez contact pour échanger sur une collaboration." },
  { k: "contact", title: "Contact" },
];
const PAGES = [
  { k: "parcours", title: "Parcours" }, { k: "realisations", title: "Réalisations" }, { k: "activites", title: "Activités" },
  { k: "evenements", title: "Événements" }, { k: "actualites", title: "Actualités" }, { k: "galerie", title: "Galerie" },
  { k: "collaboration", title: "Collaboration", intro: "Cette page s’adresse à toute structure souhaitant échanger sur une collaboration ou une opportunité de partenariat." },
  { k: "contact", title: "Contact" },
];

export const HOME_FIELDS: TextField[] = [
  { key: "h1", label: "Bannière d’accueil", type: "heading" },
  { key: "hero_image", label: "Image de bannière (fond de l’accueil)", type: "image", help: "Optionnelle. Sans image, l’accueil affiche le portrait du profil s’il existe." },
  { key: "hero_title", label: "Titre principal", type: "text", help: "Vide = nom du profil." },
  { key: "hero_subtitle", label: "Sous-titre", type: "text", help: "Vide = fonctions du profil." },
  { key: "hero_text", label: "Texte d’introduction", type: "textarea", help: "Vide = biographie courte du profil." },
  { key: "hero_cta1_label", label: "Bouton 1 — texte", type: "text", def: "Découvrir le parcours" },
  { key: "hero_cta1_link", label: "Bouton 1 — lien", type: "text", def: "/parcours", help: "Chemin du site (/contact) ou URL complète." },
  { key: "hero_cta2_label", label: "Bouton 2 — texte", type: "text", def: "Contact" },
  { key: "hero_cta2_link", label: "Bouton 2 — lien", type: "text", def: "/contact" },
  ...SECTIONS.flatMap((s): TextField[] => [
    { key: `h_s_${s.k}`, label: `Section « ${s.title} » (accueil)`, type: "heading" },
    { key: `s_${s.k}_show`, label: "Afficher sur l’accueil", type: "select", options: YN, def: "Oui" },
    { key: `s_${s.k}_title`, label: "Titre", type: "text", def: s.title },
    { key: `s_${s.k}_intro`, label: "Texte d’introduction", type: "textarea", def: s.intro ?? "" },
    ...(s.more ? [{ key: `s_${s.k}_more`, label: "Texte du bouton « voir tout »", type: "text", def: s.more } as TextField] : []),
  ]),
];

export const PAGE_FIELDS: TextField[] = [
  ...PAGES.flatMap((p): TextField[] => [
    { key: `h_p_${p.k}`, label: `Page « ${p.title} »`, type: "heading" },
    { key: `p_${p.k}_title`, label: "Titre de la page", type: "text", def: p.title },
    { key: `p_${p.k}_intro`, label: "Texte d’introduction", type: "textarea", def: p.intro ?? "" },
    { key: `p_${p.k}_banner`, label: "Bannière de la page", type: "image" },
    { key: `p_${p.k}_seo`, label: "Description pour Google (SEO)", type: "textarea" },
  ]),
  { key: "h_collab", label: "Page Collaboration — contenu", type: "heading" },
  { key: "collab_list", label: "Types de partenaires (un par ligne)", type: "textarea",
    def: "Entreprises\nOrganisations\nInstitutions\nMédias\nAssociations\nPartenaires nationaux\nPartenaires internationaux" },
  { key: "collab_cta_label", label: "Bouton de l’accueil", type: "text", def: "Collaborer" },
  { key: "collab_contact_label", label: "Bouton de la page", type: "text", def: "Voir les coordonnées" },
  { key: "h_contact", label: "Contact — libellés", type: "heading" },
  { key: "contact_call", label: "Bouton appel", type: "text", def: "Appeler" },
  { key: "contact_whatsapp", label: "Bouton WhatsApp", type: "text", def: "WhatsApp" },
  { key: "contact_mail", label: "Bouton e-mail", type: "text", def: "Envoyer un e-mail" },
  { key: "contact_phone_label", label: "Libellé téléphone", type: "text", def: "Téléphone" },
  { key: "contact_email_label", label: "Libellé e-mail", type: "text", def: "E-mail" },
  { key: "contact_empty", label: "Message si aucune coordonnée", type: "text", def: "Les coordonnées publiques seront bientôt disponibles." },
  { key: "h_events", label: "Événements — groupes", type: "heading" },
  { key: "ev_upcoming", label: "À venir", type: "text", def: "À venir" },
  { key: "ev_current", label: "En cours", type: "text", def: "En cours" },
  { key: "ev_past", label: "Passés", type: "text", def: "Passés" },
  { key: "h_labels", label: "Libellés généraux", type: "heading" },
  { key: "empty_text", label: "Message « aucun contenu »", type: "text", def: "Aucun contenu publié pour le moment." },
  { key: "empty_search", label: "Message « aucun résultat »", type: "text", def: "Aucun article ne correspond à votre recherche." },
  { key: "search_placeholder", label: "Champ de recherche", type: "text", def: "Rechercher un article" },
  { key: "label_all", label: "Filtre « toutes »", type: "text", def: "Toutes" },
  { key: "label_more", label: "Lien « en savoir plus »", type: "text", def: "En savoir plus" },
  { key: "label_website", label: "Lien « site web »", type: "text", def: "Site web" },
  { key: "label_source", label: "Lien « source »", type: "text", def: "Source" },
  { key: "label_result", label: "Libellé « résultat »", type: "text", def: "Résultat" },
  { key: "label_domains", label: "Libellé « domaines d’activité »", type: "text", def: "Domaines d’activité" },
  { key: "label_location", label: "Libellé « localisation »", type: "text", def: "Localisation" },
  { key: "label_prev", label: "Pagination — précédent", type: "text", def: "Précédent" },
  { key: "label_next", label: "Pagination — suivant", type: "text", def: "Suivant" },
  { key: "label_back_news", label: "Retour aux actualités", type: "text", def: "Retour aux actualités" },
];

export const CHROME_FIELDS: TextField[] = [
  { key: "h_nav", label: "Menu (ordre fixe ; texte et visibilité modifiables)", type: "heading" },
  ...NAV_BASE.flatMap((n): TextField[] => [
    { key: `nav_${n.key}_label`, label: `Menu « ${n.label} » — texte`, type: "text", def: n.label },
    { key: `nav_${n.key}_show`, label: `Menu « ${n.label} » — afficher`, type: "select", options: YN, def: "Oui" },
  ]),
  { key: "h_footer", label: "Pied de page", type: "heading" },
  { key: "footer_text", label: "Texte du pied de page", type: "textarea" },
  { key: "footer_copyright", label: "Mention de copyright", type: "text", def: "© {year} {name}", help: "{year} et {name} sont remplacés automatiquement." },
  { key: "h_nf", label: "Page introuvable (404)", type: "heading" },
  { key: "nf_title", label: "Titre", type: "text", def: "Page introuvable" },
  { key: "nf_text", label: "Texte", type: "text", def: "Cette page n’existe pas ou n’est plus publiée." },
  { key: "nf_button", label: "Bouton", type: "text", def: "Retour à l’accueil" },
];

export const ALL_TEXT_FIELDS = [...HOME_FIELDS, ...PAGE_FIELDS, ...CHROME_FIELDS];
export const DEFAULTS: Texts = Object.fromEntries(ALL_TEXT_FIELDS.filter((f) => f.type !== "heading").map((f) => [f.key, f.def ?? ""]));

/** Valeurs enregistrées > valeurs par défaut. Une valeur vide retombe sur le défaut. */
export const mergeTexts = (stored: Record<string, unknown> | null): Texts => {
  const out = { ...DEFAULTS };
  if (stored) for (const [k, v] of Object.entries(stored)) if (typeof v === "string" && v.trim() !== "" && k in DEFAULTS) out[k] = v;
  return out;
};
export const resolveNav = (t: Texts): NavItem[] =>
  NAV_BASE.filter((n) => t[`nav_${n.key}_show`] !== "Non").map((n) => ({ key: n.key, href: n.href, label: t[`nav_${n.key}_label`] || n.label }));
export const tpl = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
