# Site officiel — Delphin GBESSE

Next.js 14 (App Router) · TypeScript strict · Tailwind CSS · Firebase Auth + Firestore (sans Storage) · Vercel.

Règle de fond : **aucune information n'est inventée**. Tout contenu doit avoir une source ou être saisi par l'administrateur.
Le public ne voit que les contenus `status = published` **et** `verificationStatus = verified` (appliqué dans le code **et** dans les règles Firestore).

## 1. Installation locale
```bash
npm install
cp .env.example .env.local   # puis remplir
npm run dev
```

## 2. Configuration Firebase
1. Console Firebase → créer un projet → ajouter une **application Web** → copier la config dans `.env.local` (`NEXT_PUBLIC_FIREBASE_*`).
2. **Authentication** → Sign-in method → activer **E-mail/Mot de passe**.
3. **Firestore Database** → créer en mode production, puis publier `firestore.rules` (onglet Règles, ou `firebase deploy --only firestore:rules`).
4. **Pas de Storage** : les images sont compressées (WebP, < 600 Ko) et stockées dans Firestore (collection `images`), puis servies par le site sous `/img/<id>`.
5. Aucun index composite n'est requis (le tri se fait côté code).

## 3. Créer le compte administrateur
1. Authentication → Users → **Ajouter un utilisateur** (e-mail + mot de passe fort).
2. Copier son **UID**.
3. Firestore → collection `adminUsers` → document dont l'**ID = UID** → ajouter un champ `role: "admin"`.
4. Se connecter sur `/login`. Sans ce document, l'accès est refusé et les règles Firestore bloquent toute écriture.

## 4. Import initial
1. Télécharger une clé de compte de service (Paramètres du projet → Comptes de service) → `serviceAccount.json` à la racine (**ne jamais commiter**).
2. `export GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json`
3. `npm run import:dry` (validation + rapport, rien d'écrit) puis `npm run import`.
Le script valide la structure, vérifie les champs obligatoires, détecte les doublons, enregistre les sources, force les éléments `needs_review` en brouillon et écrit un rapport `scripts/import/report-*.json`.

## 5. Déploiement Vercel
1. Pousser le dépôt sur GitHub → Vercel → *Import Project*.
2. Ajouter les variables `NEXT_PUBLIC_FIREBASE_*` et `NEXT_PUBLIC_SITE_URL` (Production + Preview).
3. Firebase → Authentication → Settings → **Domaines autorisés** : ajouter le domaine Vercel / personnalisé.
4. Déployer. Les pages publiques se régénèrent toutes les 60 s (ISR) : une publication depuis le dashboard apparaît en ≤ 1 min.

## 6. Utilisation du dashboard (`/admin`)
- **Informations à vérifier** : tout ce qui est `needs_review` (valider, publier, modifier, rejeter, supprimer).
- **Paramètres → Logo** : si un logo est présent, il s'affiche **seul** (header, drawer mobile, footer) ; sinon le nom « Delphin GBESSE » s'affiche.
- Les images sont validées (JPEG/PNG/WebP, 15 Mo max), redimensionnées et converties en WebP < 600 Ko avant enregistrement dans Firestore.

## Tout est modifiable depuis le dashboard
- **Page d'accueil** : image de bannière, titre, sous-titre, texte, boutons (texte + lien), et pour chaque section : afficher/masquer, titre, texte, bouton « voir tout ».
- **Pages** : titre, texte, bannière et description SEO de chaque page ; liste des partenaires de la page Collaboration ; libellés (boutons de contact, filtres, pagination, messages vides).
- **Menu, pied de page, 404** : texte et visibilité de chaque entrée du menu, texte et copyright du pied de page, page introuvable.
- **Profil** (nom, photo, bios, fonctions, coordonnées), **Paramètres** (logo, SEO), et toutes les collections (parcours, événements, activités, réalisations, projets, organisations, actualités, galerie, réseaux sociaux).
- Un champ laissé vide retombe sur un libellé neutre par défaut (ex. « Parcours ») ; aucune information factuelle n'est préremplie.
- Les textes sont stockés dans `settings/texts` (Firestore), le logo/SEO dans `settings/main`.
- Les modifications apparaissent sur le site en moins d'une minute.

## Notes
- « Entreprises » et « Organisations » partagent la collection `organizations` (champ `kind`).
- Pas de formulaire de contact : uniquement les coordonnées saisies dans le profil (Appeler / WhatsApp / E-mail).
- La protection du dashboard côté navigateur est une commodité ; la sécurité réelle repose sur les règles Firestore.
