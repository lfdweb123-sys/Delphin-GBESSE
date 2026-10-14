/**
 * Contenus à importer dans Firestore depuis le navigateur (/admin/import).
 *
 * Tout ce qui a déjà été importé a été retiré de ce fichier : il ne peut plus être réimporté.
 * Les nouveaux contenus sont ajoutés ici au fur et à mesure qu'ils sont envoyés.
 * - Images : fichiers WebP dans /public/seed/<clé>.webp, listés dans SEED_IMAGES (référencés par « @img:<clé> »).
 * - Documents : identifiants fixes, pour qu'un nouvel import n'en crée pas de doublon.
 */
export interface SeedImage { key: string; file: string }
export interface SeedDoc { id: string; data: Record<string, unknown> }

export const SEED_IMAGES: SeedImage[] = [];
export const SEED_SERVICES: SeedDoc[] = [];
export const SEED_MATERIELS: SeedDoc[] = [];
export const SEED_ORGANIZATIONS: SeedDoc[] = [];
export const SEED_TIMELINE: SeedDoc[] = [];
export const SEED_NEWS: SeedDoc[] = [];
export const SEED_GALLERY: SeedDoc[] = [];
