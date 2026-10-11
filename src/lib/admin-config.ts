import { CHROME_FIELDS, HOME_FIELDS, PAGE_FIELDS, type TextField } from "./texts";

export type FieldType = "text" | "textarea" | "date" | "url" | "image" | "select" | "heading";
export interface Field { key: string; label: string; type: FieldType; required?: boolean; options?: string[]; help?: string }
export interface Section {
  slug: string; label: string; collection: string; docId?: string; titleKey: string; single?: boolean; noPublish?: boolean; fields: Field[];
}

const fromText = (fs: TextField[]): Field[] => fs.map((f) => ({ key: f.key, label: f.label, type: f.type, options: f.options, help: f.help }));
const title: Field = { key: "title", label: "Titre", type: "text", required: true };
const desc: Field = { key: "description", label: "Description", type: "textarea" };
const date: Field = { key: "date", label: "Date", type: "date" };
const image: Field = { key: "image", label: "Image", type: "image" };
const category: Field = { key: "category", label: "Catégorie", type: "text" };
const url: Field = { key: "url", label: "Lien", type: "url" };

export const SECTIONS: Section[] = [
  { slug: "profil", label: "Profil", collection: "profile", titleKey: "name", single: true, fields: [
    { key: "name", label: "Nom", type: "text", required: true }, { key: "photo", label: "Photo", type: "image" },
    { key: "shortBio", label: "Biographie courte", type: "textarea" }, { key: "fullBio", label: "Biographie complète", type: "textarea" },
    { key: "presentation", label: "Présentation", type: "textarea" }, { key: "roles", label: "Fonctions", type: "text" },
    { key: "responsibilities", label: "Responsabilités", type: "textarea" }, { key: "location", label: "Localisation publique", type: "text" },
    { key: "domains", label: "Domaines d’activité", type: "text" }, { key: "phone", label: "Téléphone", type: "text" },
    { key: "whatsapp", label: "WhatsApp (format international, ex. +229…)", type: "text" }, { key: "email", label: "Adresse e-mail", type: "text" },
  ] },
  { slug: "textes-accueil", label: "Page d’accueil (textes, bannières)", collection: "settings", docId: "texts", titleKey: "hero_title", single: true, fields: fromText(HOME_FIELDS) },
  { slug: "textes-pages", label: "Pages (titres, bannières, libellés)", collection: "settings", docId: "texts", titleKey: "hero_title", single: true, fields: fromText(PAGE_FIELDS) },
  { slug: "textes-menu", label: "Menu, pied de page, page 404", collection: "settings", docId: "texts", titleKey: "hero_title", single: true, fields: fromText(CHROME_FIELDS) },
  { slug: "parcours", label: "Parcours", collection: "timeline", titleKey: "title", fields: [{ ...title }, { ...date, required: true }, desc, category, image, url] },
  { slug: "evenements", label: "Événements", collection: "events", titleKey: "title", fields: [
    title, desc, { ...date, required: true }, { key: "endDate", label: "Date de fin", type: "date" }, { key: "time", label: "Heure", type: "text" },
    { key: "location", label: "Lieu", type: "text" }, image, { key: "participants", label: "Participants", type: "textarea" }, url] },
  { slug: "activites", label: "Activités", collection: "activities", titleKey: "title", fields: [title, desc, date, category, image, url] },
  { slug: "realisations", label: "Réalisations", collection: "achievements", titleKey: "title", fields: [title, desc, date, category, image, { key: "result", label: "Résultat", type: "text" }, url] },
  { slug: "projets", label: "Projets", collection: "projects", titleKey: "title", fields: [title, desc, date, category, image, url] },
  { slug: "organisations", label: "Entreprises / Organisations", collection: "organizations", titleKey: "name", fields: [
    { key: "name", label: "Nom", type: "text", required: true }, { key: "kind", label: "Type", type: "select", options: ["Organisation", "Entreprise"] },
    { key: "logo", label: "Logo", type: "image" }, desc, { key: "role", label: "Rôle", type: "text" }, { key: "period", label: "Période", type: "text" },
    { key: "website", label: "Site web", type: "url" }] },
  { slug: "actualites", label: "Actualités", collection: "news", titleKey: "title", fields: [
    title, { key: "slug", label: "Identifiant d’URL (auto si vide)", type: "text" }, { key: "content", label: "Contenu", type: "textarea", required: true },
    image, { ...date, required: true }, { key: "author", label: "Auteur", type: "text" }, category] },
  { slug: "galerie", label: "Galerie", collection: "gallery", titleKey: "alt", fields: [
    { key: "image", label: "Image", type: "image", required: true }, { key: "alt", label: "Texte alternatif", type: "text", required: true },
    { key: "title", label: "Légende", type: "text" }, category] },
  { slug: "reseaux", label: "Réseaux sociaux", collection: "socialLinks", titleKey: "network", fields: [
    { key: "network", label: "Réseau", type: "select", required: true, options: ["Facebook", "Instagram", "X", "LinkedIn", "YouTube", "TikTok", "Autre"] },
    { key: "url", label: "URL du compte officiel", type: "url", required: true }] },
  { slug: "sources", label: "Sources", collection: "sources", titleKey: "name", noPublish: true, fields: [
    { key: "name", label: "Nom", type: "text", required: true }, { key: "url", label: "URL", type: "url", required: true },
    { key: "type", label: "Type", type: "select", options: ["presse", "institution", "document_officiel", "réseau_social", "site_web", "vidéo", "autre"] },
    { key: "publishedAt", label: "Publiée le", type: "date" }, { key: "collectedAt", label: "Collectée le", type: "date" },
    { key: "verificationStatus", label: "Statut de vérification", type: "select", options: ["verified", "needs_review"] }] },
  { slug: "parametres", label: "Paramètres", collection: "settings", titleKey: "siteTitle", single: true, fields: [
    { key: "logoUrl", label: "Logo de l’en-tête et du menu (version pour fond blanc)", type: "image", help: "Affiché seul, à la place du nom. Sans logo, le nom s’affiche automatiquement." },
    { key: "logoFooterUrl", label: "Logo du pied de page (version pour fond noir)", type: "image", help: "Utilisez une version claire ou blanche. Sans logo, le nom s’affiche en blanc." },
    { key: "siteTitle", label: "Titre du site (SEO)", type: "text" }, { key: "siteDescription", label: "Description du site (SEO)", type: "textarea" }] },
];
export const REVIEWABLE = SECTIONS.filter((s) => !s.noPublish && !s.single);
