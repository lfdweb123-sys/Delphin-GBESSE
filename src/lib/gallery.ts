/** Catégories de la galerie visibles uniquement quand on les sélectionne (jamais dans « Toutes » ni sur l'accueil). */
const ONLY_IN_OWN_FILTER = ["matériels", "materiels"];
export const isOwnFilterOnly = (category?: string) => !!category && ONLY_IN_OWN_FILTER.includes(category.trim().toLowerCase());
