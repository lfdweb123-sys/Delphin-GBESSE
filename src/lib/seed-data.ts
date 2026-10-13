/**
 * Contenus initiaux (services, articles, galerie, entreprise, parcours) importés depuis le navigateur
 * via /admin/import. Les images sont dans /public/seed (WebP) et sont enregistrées dans Firestore (collection `images`).
 * Les identifiants sont fixes : relancer l'import met à jour les mêmes documents sans créer de doublons.
 */
export interface SeedImage { key: string; file: string }
export interface SeedDoc { id: string; data: Record<string, unknown> }

const IMG = (key: string) => `@img:${key}`;

export const SEED_IMAGES: SeedImage[] = [
  "svc-ill-import-export", "svc-ill-materiaux", "svc-ill-quincaillerie", "svc-ill-bois", "svc-ill-batiment", "svc-ill-assainissement", "svc-ill-machines",
  "news-independance", "news-bacheliers", "news-conseiller", "news-candidat", "news-rentree", "news-dgiz", "news-debut-semaine",
  "news-fete-travail", "news-mi-semaine", "news-hommage-leader", "news-hommage-engage", "news-communaute-lacustre",
  "gal-bureau-1", "gal-bureau-2", "gal-bureau-3", "gal-ceremonie", "gal-chantier", "gal-rencontre-partenaire", "gal-reunion-affaires", "gal-portrait-costume",
  "logo-gbedel",
].map((key) => ({ key, file: `/seed/${key}.webp` }));

/** Services (collection `activities`). */
export const SEED_SERVICES: SeedDoc[] = [
  { id: "service-import-export", data: { order: "1", title: "Import-export", image: IMG("svc-ill-import-export"),
    description: "Import-export de matériels, matériaux et marchandises : tout le nécessaire pour vos chantiers de construction, publics ou privés." } },
  { id: "service-importation-materiaux", data: { order: "2", title: "Importation de matériels et matériaux de construction, boissons", image: IMG("svc-ill-materiaux"),
    description: "Importation de matériels et de matériaux de construction, ainsi que de boissons." } },
  { id: "service-quincaillerie-ciments", data: { order: "3", title: "Quincaillerie, achat et vente de ciments", image: IMG("svc-ill-quincaillerie"),
    description: "Quincailleries, achat et vente de ciments." } },
  { id: "service-produits-forestiers", data: { order: "4", title: "Produits forestiers et tropicaux, menuiserie, scierie, BTP", image: IMG("svc-ill-bois"),
    description: "Achat et vente des produits forestiers et tropicaux, menuiserie, scierie, BTP." } },
  { id: "service-construction-revetement", data: { order: "5", title: "Construction et revêtement de bâtiments", image: IMG("svc-ill-batiment"),
    description: "Construction et revêtement de bâtiments." } },
  { id: "service-assainissement-curage", data: { order: "6", title: "Assainissement et curage d’équipements", image: IMG("svc-ill-assainissement"),
    description: "Assainissement et curage d’équipements." } },
  { id: "service-machines-menuiserie-vitrerie", data: { order: "7", title: "Machines pour la menuiserie et la vitrerie", image: IMG("svc-ill-machines"),
    description: "Achat et vente de toutes machines pour la menuiserie et la vitrerie." } },
];

export const SEED_ORGANIZATIONS: SeedDoc[] = [
  { id: "gbedel", data: { name: "GBEDEL", kind: "Entreprise", role: "Commerce général, import-export et BTP", logo: IMG("logo-gbedel"),
    description: "Tout le nécessaire pour vos chantiers de construction, publics ou privés.\nNos engagements : qualité, prix compétitifs, disponibilité, rapidité, conseil, fiabilité." } },
];

export const SEED_TIMELINE: SeedDoc[] = [
  { id: "candidat-br-ganvie-2", data: { title: "Candidat 1er titulaire du Bloc Républicain — arrondissement de Ganvié II", date: "2026-01-05",
    description: "Élections communales de janvier 2026, commune de Sô-Ava.", category: "Politique", image: IMG("news-candidat") } },
];

export const SEED_GALLERY: SeedDoc[] = [
  { id: "gal-bureau-1", data: { image: IMG("gal-bureau-1"), alt: "Delphin GBESSE, Directeur Général, à son bureau devant la banderole GBEDEL", title: "Au bureau — GBEDEL", category: "Entreprise" } },
  { id: "gal-bureau-2", data: { image: IMG("gal-bureau-2"), alt: "Delphin GBESSE consultant un document à son bureau", title: "Au bureau", category: "Entreprise" } },
  { id: "gal-bureau-3", data: { image: IMG("gal-bureau-3"), alt: "Delphin GBESSE à son bureau, banderole des prestations de service GBEDEL", title: "Prestations de service GBEDEL", category: "Entreprise" } },
  { id: "gal-chantier", data: { image: IMG("gal-chantier"), alt: "Delphin GBESSE dans le bureau d’un site de chantier", title: "Sur site", category: "Entreprise" } },
  { id: "gal-rencontre-partenaire", data: { image: IMG("gal-rencontre-partenaire"), alt: "Delphin GBESSE devant un magasin lors d’une rencontre avec un partenaire", title: "Rencontre avec un partenaire", category: "Entreprise" } },
  { id: "gal-reunion-affaires", data: { image: IMG("gal-reunion-affaires"), alt: "Delphin GBESSE en réunion d’affaires dans un magasin de peinture", title: "Réunion d’affaires", category: "Entreprise" } },
  { id: "gal-portrait-costume", data: { image: IMG("gal-portrait-costume"), alt: "Portrait de Delphin GBESSE en costume bleu marine, souriant", title: "Portrait", category: "Portraits" } },
  { id: "gal-ceremonie", data: { image: IMG("gal-ceremonie"), alt: "Délégation d’élus en écharpe aux couleurs nationales saluant des invités lors d’une cérémonie", title: "Cérémonie officielle", category: "Événements" } },
];

const A = "Delphin GBESSE";
const SIGN = "La vraie information avec Mahugnon Firmin 96 80 43 02.";

export const SEED_NEWS: SeedDoc[] = [
  { id: "message-fete-independance", data: { slug: "message-fete-independance", title: "Message du Conseiller Delphin GBESSE Cherif Deen pour la fête de l’indépendance",
    date: "2026-08-01", category: "Messages", author: A, image: IMG("news-independance"),
    content: `Chères concitoyennes, chers concitoyens du Bénin,

Chers habitants de la commune lacustre de Sô-Ava,

En ce jour mémorable où notre pays célèbre ses 66 ans d'indépendance, j'adresse mes vœux les plus chaleureux à l'ensemble du peuple béninois et, de manière toute particulière, aux vaillantes populations de Sô-Ava. Cette commémoration nationale est l'occasion de réaffirmer notre attachement aux valeurs républicaines et à notre souveraineté partagée.

Pour notre commune, les spécificités de notre environnement lacustre exigent une vision politique audacieuse, pragmatique et résolument tournée vers l'avenir. Nos particularités géographiques ne doivent plus être des freins au progrès, mais le point de départ d'un développement endogène, durable et adapté aux réalités de notre milieu de vie.

Notre engagement au service de la communauté demeure total. Il s'articule autour de priorités concrètes : l'amélioration du cadre de vie, le renforcement des infrastructures de base, l'accompagnement de nos acteurs économiques locaux et la création d'opportunités pérennes pour notre jeunesse. C'est par l'action collective et la rigueur dans la gouvernance que nous relèverons ces défis.

L'indépendance est une construction quotidienne qui exige l'implication de chaque citoyen. Unissons nos forces et cultivons l'esprit de solidarité pour bâtir une commune de Sô-Ava plus prospère, moderne et solidaire au sein d'un Bénin uni et triomphant.

Excellente fête de l'indépendance à toutes et à tous !

Vive Sô-Ava,
Vive le Bénin !

Delphin GBESSE Cherif Deen.
C.com Delphin GBESSE CHERIF DEEN` } },

  { id: "message-nouveaux-bacheliers", data: { slug: "message-nouveaux-bacheliers", title: "Message du Conseiller Delphin GBESSE aux nouveaux bacheliers",
    date: "2026-07-20", category: "Messages", author: A, image: IMG("news-bacheliers"),
    content: `Chers nouveaux bacheliers,

C'est avec une immense fierté et une profonde satisfaction que je vous adresse mes plus vives félicitations pour l'obtention de votre premier diplôme universitaire.

Ce succès, fruit de votre persévérance, de votre rigueur et de votre abnégation, marque une étape décisive dans votre parcours académique et professionnel.

Une mention toute particulière aux filles et fils de notre chère commune de Sô-Ava. Par votre réussite, vous portez haut le flambeau de notre localité et vous devenez, dès aujourd'hui, les modèles inspirants de la jeunesse de notre terre commune.

Je vous exhorte à maintenir cette dynamique d'excellence, à rester curieux, ambitieux et toujours en quête de savoir, car vous êtes les bâtisseurs du Bénin de demain. Que ce parchemin soit le socle d'une carrière brillante et le prélude à de grandes contributions pour le développement de notre nation.

Toutes mes félicitations pour cette belle victoire !

Très cordialement,
Delphin GBESSE
Conseiller.

C.com Delphin GBESSE 96 80 43 02.` } },

  { id: "cherif-deen-gbesse-dynamisme-vision", data: { slug: "cherif-deen-gbesse-dynamisme-vision", title: "Cherif Deen GBESSE : le dynamisme et la vision au cœur de Sô-Ava",
    date: "2026-06-15", category: "Portrait", author: A, image: IMG("news-conseiller"),
    content: `Le développement local exige aujourd'hui des leaders d'action et d'impact.

Au sein du Conseil Communal de Sô-Ava, Monsieur conseiller Cherif Deen GBESSE incarne avec brio cette nouvelle génération d'hommes politiques visionnaires, engagés pour le progrès de leur communauté.

Une vision stratégique : fin connaisseur des réalités de la commune, il porte au sein du conseil des solutions innovantes et structurantes, axées sur la modernisation et la valorisation du potentiel local.

Un dynamisme de terrain : homme de solutions et de consensus, il allie rigueur managériale et proximité avec les populations pour transformer les défis de Sô-Ava en opportunités concrètes.

Le choix de l'avenir : leader inspirant pour la jeunesse et acteur clé de la décentralisation, le Conseiller Cherif Deen GBESSE s'impose par sa probité et son sens élevé du service public.

L'impact par l'action : avec Cherif Deen GBESSE, Sô-Ava avance vers une gouvernance moderne, inclusive et résolument tournée vers la prospérité.

C.com Cherif Deen GBESSE 96 80 43 02.` } },

  { id: "message-du-candidat-communales-2026", data: { slug: "message-du-candidat-communales-2026", title: "Message du candidat Delphin GBESSE — élections communales de janvier 2026",
    date: "2026-01-05", category: "Élections", author: A, image: IMG("news-candidat"),
    content: `Chères populations de la commune de Sô-Ava,
Chères populations de l'arrondissement de Ganvié II,

Frères et sœurs,

Les élections communales de janvier 2026 constituent un tournant décisif pour l'avenir de notre chère commune. Elles sont une occasion historique de consolider les acquis, de renforcer la gouvernance locale et de poursuivre résolument le chemin du développement durable et inclusif.

Aujourd'hui, avec responsabilité, engagement et détermination, je me présente devant vous : GBESSE Delphin, Candidat 1er titulaire du Bloc Républicain dans l'arrondissement de Ganvié II.

Je porte une vision claire :
👉 Une commune de Sô-Ava plus forte, mieux organisée et tournée vers le progrès continu.
👉 Une gouvernance locale fondée sur l'écoute, la proximité avec les populations et la recherche de solutions concrètes aux préoccupations quotidiennes.
👉 Une jeunesse valorisée, des femmes accompagnées, une économie locale renforcée et un cadre de vie amélioré pour tous.

Le Bloc Républicain, parti de stabilité, de responsabilité et d'action, incarne cette dynamique de progrès. Il œuvre chaque jour pour un Bénin plus uni, plus juste et plus prospère. À Sô-Ava, nous voulons aller plus loin, ensemble, sans exclusion, sans division, dans un esprit de paix et de solidarité.

Chères populations, le moment est venu de faire un choix utile, un choix responsable, un choix pour l'avenir.
👉 Votons tous Bloc Républicain (BR)
👉 Votons pour le progrès continu de la commune de Sô-Ava
👉 Votons pour une équipe engagée, proche du peuple et tournée vers les résultats

Avec votre confiance et votre mobilisation, nous construirons une commune plus forte et un avenir meilleur pour nos enfants.

Plus unis, plus forts, pour construire le Bénin.
Je compte sur vous.

Vive Ganvié II,
Vive Sô-Ava,
Vive le Bloc Républicain,
Vive la démocratie béninoise.

${SIGN}` } },

  { id: "message-rentree-scolaire-2025-2026", data: { slug: "message-rentree-scolaire-2025-2026", title: "Message du leader Delphin GBESSE aux élèves et étudiants — rentrée scolaire 2025-2026",
    date: "2025-10-06", category: "Messages", author: A, image: IMG("news-rentree"),
    content: `En ma qualité de Coordonnateur du Parti Bloc Républicain dans l'arrondissement de Ganvié 2, Commune de Sô-Ava, je tiens à adresser mes vives félicitations et mes encouragements à tous les acteurs du système éducatif à l'occasion de cette nouvelle rentrée scolaire et universitaire.

À vous, chers écoliers, collégiens, lycéens et étudiants, je formule le vœu d'une année académique fructueuse, marquée par la discipline, la persévérance et l'excellence. Que vos efforts constants trouvent leur juste récompense dans vos résultats.

À vous, honorables enseignants, véritables bâtisseurs de l'avenir, je rends hommage à votre sens du devoir et à votre engagement permanent au service du savoir. Vous êtes les piliers essentiels de la réussite éducative dans notre pays.

Enfin, à vous chers parents, je reconnais votre rôle indispensable dans l'accompagnement quotidien de vos enfants. Votre soutien moral et matériel demeure le socle de leur réussite.

Que cette rentrée scolaire et universitaire soit placée sous le signe du travail bien fait, de la responsabilité partagée et de la réussite collective, pour le rayonnement de notre commune lacustre de Sô-Ava et, au-delà, pour l'avenir radieux de toute la jeunesse béninoise.

Delphin GBESSE
Coordonnateur du Parti Bloc Républicain
Arrondissement de Ganvié 2, Commune de Sô-Ava

${SIGN}` } },

  { id: "visite-dgiz-coordonnateur", data: { slug: "visite-dgiz-coordonnateur", title: "Visite du Coordonnateur Delphin GBESSE au DGIZ",
    date: "2025-09-15", category: "Actualité", author: A, image: IMG("news-dgiz"),
    content: `Dans le cadre du suivi citoyen des actions gouvernementales, Monsieur Delphin GBESSE, Coordonnateur du Parti Bloc Républicain dans l'arrondissement de Ganvié 2 (Commune de Sô-Ava), Chef d'entreprise et acteur politique engagé, a effectué une visite au DGIZ.

À travers cette initiative, le Coordonnateur a voulu exprimer, à la fois en sa qualité de leader politique, de PDG et de citoyen béninois conscient des enjeux de développement, toute son appréciation pour les réformes et réalisations visibles initiées par le Gouvernement du Bénin, sous la houlette de Son Excellence Monsieur Guillaume Athanase Patrice TALON, Président de la République, Chef de l'État, Chef du Gouvernement.

Cette visite fut l'occasion pour lui de constater avec satisfaction les résultats concrets découlant de la vision stratégique du Chef de l'État, vision qui incarne un leadership audacieux et une volonté inébranlable de transformer durablement notre pays.

En outre, le Coordonnateur Delphin GBESSE a adressé ses félicitations au Gouvernement et a réaffirmé son engagement à poursuivre, aux côtés de ses pairs du Bloc Républicain, la mobilisation et la sensibilisation des populations pour soutenir cette dynamique nationale.

Enfin, il a souhaité un plein succès aux travaux du séminaire et invité chaque citoyen béninois à s'inscrire résolument dans la voie du patriotisme et de la contribution collective pour consolider l'édifice du développement.

Vive le Bénin !
Vive le leadership du Président Patrice TALON !
En marche vers la prospérité partagée.

${SIGN}` } },

  { id: "message-debut-de-semaine", data: { slug: "message-debut-de-semaine", title: "Message du leader Delphin GBESSE — début de semaine",
    date: "2025-06-02", category: "Messages", author: A, image: IMG("news-debut-semaine"),
    content: `Message du leader Delphin GBESSE
Coordonnateur du Parti Bloc Républicain, Arrondissement de Ganvié 2, Commune de Sô-Ava

En ce début de semaine, je tiens à adresser mes salutations républicaines et mes vœux de succès à l'ensemble de la communauté béninoise.
J'exprime ma profonde considération à Son Excellence Monsieur Athanase Patrice Guillaume TALON, Président de la République du Bénin, dont le leadership et la vision continuent d'inspirer et de guider notre nation vers le progrès et la prospérité.

À nos chefs d'entreprises, piliers du développement économique, je souhaite une semaine fructueuse et pleine d'opportunités.
À notre vaillante jeunesse, moteur du changement et de l'innovation, je réaffirme mon engagement à œuvrer pour un avenir meilleur et inclusif.
À nos commerçants, artisans et acteurs économiques, je vous encourage à persévérer dans vos efforts, véritables forces vives qui dynamisent notre économie locale et nationale.

Que cette nouvelle semaine soit pour chacun une source de motivation, de détermination et d'accomplissement. Ensemble, unis dans l'action et la solidarité, nous bâtissons un Bénin toujours plus fort.

Delphin GBESSE
Coordonnateur BR de l'arrondissement de Ganvié 2, Commune de Sô-Ava

${SIGN}` } },

  { id: "message-journee-internationale-du-travail", data: { slug: "message-journee-internationale-du-travail", title: "Message du PDG Delphin GBESSE à l’occasion de la Journée internationale du travail — 1er mai",
    date: "2025-05-01", category: "Messages", author: A, image: IMG("news-fete-travail"),
    content: `Mesdames et Messieurs,
Chers travailleurs et travailleuses du monde entier,
Chers fils et filles de la commune de Sô-Ava,

En ce 1er mai, jour hautement symbolique qui célèbre l'effort humain, l'engagement professionnel et la dignité du travailleur, je tiens à vous adresser un message de respect, de reconnaissance et d'espérance.

La Journée Internationale du Travail n'est pas simplement une date sur le calendrier. C'est un moment fort, une halte solennelle qui nous rappelle que derrière chaque progrès économique, chaque réalisation communautaire, chaque avancée sociale, il y a des femmes et des hommes qui travaillent avec abnégation, compétence et passion.

À nous tous, travailleurs de l'ombre ou de la lumière, salariés du secteur public comme du secteur privé, entrepreneurs, artisans, commerçants, agriculteurs, pêcheurs, enseignants, agents de santé, ouvriers, transporteurs, femmes battantes et jeunes dynamiques, je vous rends un vibrant hommage. Vous êtes le cœur battant de nos sociétés. Sans vous, rien ne serait possible.

Je salue en particulier les vaillants travailleurs de la commune de Sô-Ava, qui, malgré les défis liés à l'environnement lacustre, à la mobilité ou aux ressources, ne cessent de faire preuve de résilience, d'initiative et d'un profond attachement à la culture du travail. Notre détermination est admirable, et notre contribution au développement local est inestimable.

Chers frères et sœurs, le travail n'est pas seulement un moyen de subsistance. Il est un facteur de dignité, d'épanouissement personnel et de transformation sociale. Il est aussi, et surtout, un levier de paix, de solidarité et de cohésion. C'est pourquoi, en cette journée, je réaffirme mon engagement personnel et celui de notre institution à promouvoir un environnement de travail plus équitable, plus sécurisé, plus inclusif, où chacun peut s'exprimer, évoluer et prospérer.

Ce 1er mai marque également le début d'un nouveau mois. Qu'il soit pour chacun de vous un temps de bénédictions, d'accomplissement et de sérénité. Puisse ce mois de mai vous ouvrir les portes de nouvelles opportunités, renforcer votre espérance, et nourrir vos ambitions les plus légitimes.

En cette journée de célébration, mais aussi de réflexion, que l'esprit de solidarité, de justice et de progrès guide toutes nos actions.

Bonne fête du travail à toutes et à tous !
Que vive la dignité du travailleur !
Que vive la commune de Sô-Ava !
Que vive le monde du travail !

Avec tout mon respect et ma considération,
PDG, Delphin GBESSE

La vraie information sans besogne avec Mahugnon Firmin 96 80 43 02.` } },

  { id: "message-mi-semaine", data: { slug: "message-mi-semaine", title: "Message du leader Delphin GBESSE — mi-semaine",
    date: "2025-04-16", category: "Messages", author: A, image: IMG("news-mi-semaine"),
    content: `Chers collègues,

Nous voici déjà à la moitié de la semaine, un moment clé où nous pouvons faire le bilan des efforts fournis et nous projeter vers l'atteinte de nos objectifs. Chaque jour, vous donnez le meilleur de vous-mêmes, et c'est grâce à votre engagement, votre discipline et votre esprit d'équipe que nous avançons ensemble vers l'excellence.

Je sais que le travail peut parfois être exigeant, que les défis peuvent sembler lourds à porter, mais rappelez-vous toujours que chaque effort compte. Chaque tâche accomplie, aussi petite soit-elle, contribue à la réussite collective. Vous êtes le moteur de cette dynamique, et je tiens à vous exprimer toute ma gratitude pour votre détermination et votre professionnalisme.

La moitié de la semaine est un tournant : c'est l'occasion de recharger nos énergies, de nous recentrer sur nos objectifs et d'aborder les jours à venir avec une attitude positive. Ne laissez pas la fatigue ou la pression vous décourager. Prenez un instant pour apprécier le travail accompli, pour vous rappeler pourquoi vous faites ce que vous faites, et surtout, pour trouver la motivation de continuer avec passion et engagement.

Je vous encourage à garder cette énergie et cette volonté intactes. Soutenons-nous les uns les autres, restons solidaires et avançons ensemble vers la fin de semaine avec la satisfaction du devoir accompli. Votre contribution est précieuse, et je suis convaincu qu'avec cette belle dynamique, nous atteindrons tous nos objectifs.

Courage à tous, et que cette deuxième moitié de la semaine soit encore plus productive et enrichissante !

Leader PDG Delphin GBESSE

La vraie information sans besogne avec Mahugnon Firmin 96 80 43 02.` } },

  { id: "leader-pdg-engagement-vulnerables", data: { slug: "leader-pdg-engagement-vulnerables", title: "Leader PDG Delphin GBESSE : un engagement au service des plus vulnérables",
    date: "2025-03-10", category: "Portrait", author: A, image: IMG("news-hommage-leader"),
    content: `Dans l'histoire des peuples et des nations, il existe des hommes dont l'engagement va bien au-delà des mandats et des fonctions. Des leaders qui ne se contentent pas de paroles, mais qui inscrivent leurs actions dans le marbre de la générosité et de l'humanisme. Vous êtes de ceux-là, un acteur dont la vision dépasse les intérêts partisans pour embrasser la noble cause du bien-être social, en particulier celui des plus vulnérables : les orphelins, les veuves et les laissés-pour-compte.

Dans un monde où l'injustice et l'indifférence creusent des fossés entre les riches et les démunis, vous vous distinguez par votre engagement indéfectible à réparer les injustices et à redonner espoir à ceux que la société tend à oublier. Vous ne vous contentez pas de constater les difficultés, vous agissez. Vous ne vous limitez pas aux promesses, vous les concrétisez. Et c'est en cela que vous incarnez un modèle de leadership inspirant et porteur d'espoir.

Un engagement au service des orphelins : donner un avenir à ceux qui n'en ont plus

L'orphelin est, par essence, un être privé d'un amour essentiel, souvent exposé aux dures réalités de la vie sans le soutien parental nécessaire. Mais grâce à votre action, ces enfants retrouvent un cadre propice à leur épanouissement. Vous leur offrez plus qu'une assistance matérielle, vous leur donnez une famille de substitution, une éducation de qualité et un avenir digne de ce nom.

Par vos initiatives en faveur des foyers d'accueil, des bourses scolaires, des programmes d'insertion et des centres de formation, vous ouvrez des portes qui semblaient fermées à ces jeunes âmes. Vous leur montrez que, malgré l'adversité, il existe encore des hommes de bonne volonté prêts à se battre pour leur avenir. Vous êtes pour eux un repère, une lumière qui éclaire leur chemin vers un avenir meilleur.

Un soutien indéfectible aux veuves : restaurer la dignité et l'espérance

La perte d'un époux est une épreuve déchirante, mais dans nos sociétés, elle s'accompagne souvent d'une exclusion sociale et d'une précarité financière accablante. Nombreuses sont les veuves qui se retrouvent seules, sans ressources, luttant pour la survie de leur famille dans l'indifférence générale.

Mais vous, en véritable serviteur du peuple, vous avez compris que le progrès d'une nation passe par le soutien à ces femmes courageuses. À travers des programmes de micro-financement, de formation professionnelle et d'accompagnement social, vous leur redonnez non seulement des moyens de subsistance, mais surtout la dignité qu'elles méritent.

Vous démontrez, par vos actions, que gouverner ne doit pas être un simple exercice de pouvoir, mais une mission de service. Vous incarnez la justice sociale en veillant à ce qu'aucune femme ne soit laissée pour compte après la perte de son époux, et en leur redonnant la possibilité de se relever avec honneur et fierté.

Une main tendue aux laissés-pour-compte : l'inclusion comme moteur du développement

La grandeur d'un leader se mesure à sa capacité à inclure tous les membres de la société dans son projet de développement. Et vous avez su comprendre que nul ne doit être oublié dans la marche vers un avenir prospère.

Les sans-abris, les personnes âgées abandonnées, les handicapés, les jeunes en situation de précarité : tous trouvent en vous un défenseur de leur cause. Vous avez mis en place des structures d'aide, des centres d'accueil, des politiques d'intégration sociale qui leur permettent de retrouver une place digne dans la communauté.

En tendant la main à ceux que beaucoup rejettent, vous donnez un sens profond à la politique, celle qui ne se limite pas aux luttes électorales, mais qui œuvre pour un véritable changement dans la vie des citoyens. Votre action prouve que la solidarité n'est pas un vain mot et que gouverner, c'est avant tout servir.

Un héritage de valeurs et d'humanité

Dans un monde où l'égoïsme et l'indifférence semblent prendre le dessus, vous nous rappelez que la véritable grandeur réside dans le don de soi. Vous incarnez cette vision d'une politique humaniste, où chaque action est motivée par la volonté d'améliorer la condition de ceux qui en ont le plus besoin.

Votre engagement est un exemple pour les générations présentes et futures. Que votre œuvre se perpétue et inspire d'autres leaders à suivre le même chemin, celui du service désintéressé, de la justice sociale et du développement inclusif.

En vous rendant hommage aujourd'hui, nous célébrons bien plus qu'un homme ou une femme politique. Nous célébrons une vision, une mission, un idéal de gouvernance fondé sur l'amour du prochain et le souci du bien-être collectif.

Puissiez-vous continuer à être cette lumière qui éclaire le chemin des oubliés, ce pilier sur lequel les plus fragiles peuvent s'appuyer, et cette voix qui parle en faveur de ceux qui n'en ont pas.

La vraie information sans besogne avec Mahugnon Firmin 96 80 43 02` } },

  { id: "hommage-leader-engage-au-service-du-peuple", data: { slug: "hommage-leader-engage-au-service-du-peuple", title: "Hommage à un leader engagé au service du peuple",
    date: "2025-03-05", category: "Portrait", author: A, image: IMG("news-hommage-engage"),
    content: `Monsieur Delphin GBESSE,

En ces temps où l'engagement sincère en faveur du bien commun se fait rare, vous incarnez avec éclat la vision d'un leadership tourné vers l'action et le progrès. Votre dévouement sans faille à l'amélioration des conditions de vie de nos concitoyens fait de vous un acteur clé du développement social et du bien-être collectif.

À travers vos initiatives en faveur des orphelins, des malades, des veufs, du soutien aux jeunes, etc., vous démontrez qu'une politique ambitieuse et humaine peut être un véritable levier de transformation. Votre présence sur le terrain, votre écoute attentive et votre détermination témoignent de votre attachement profond aux valeurs de justice, d'équité et de solidarité.

Grâce à votre leadership éclairé, de nombreuses vies ont été impactées positivement, et votre engagement inspire une nouvelle génération à croire en un avenir meilleur. Que votre passion pour le service public continue d'illuminer notre chemin vers un développement durable et inclusif.

Recevez nos plus vives félicitations et notre profonde gratitude pour votre engagement exemplaire.

Vive le PDG Delphin GBESSE ! Vive le progrès ! Vive le développement social !

${SIGN}` } },

  { id: "lettre-de-la-communaute-lacustre", data: { slug: "lettre-de-la-communaute-lacustre", title: "Lettre de remerciement de la communauté lacustre",
    date: "2025-02-20", category: "Remerciements", author: "La communauté lacustre", image: IMG("news-communaute-lacustre"),
    content: `Cher Delphin GBESSE,

Il y a des âmes nobles qui, sans bruit, sèment la bonté autour d'elles. Vous êtes de celles-là. Par votre générosité, vous avez illuminé plusieurs routes, dissipant les ombres du doute et du besoin.

Votre aide précieuse est comme une étoile dans la nuit, un souffle d'espoir dans l'adversité. Grâce à vous, un nouveau chapitre s'écrit, empli de promesses et de lumière.

Que la vie vous rende au centuple ce que vous donnez avec tant de cœur à la communauté lacustre. Recevez, en retour, la plus profonde gratitude.

Avec toutes nos reconnaissances.
La communauté lacustre.

La vraie information sans besogne avec Mahugnon Firmin 96804302` } },
];

/** Anciennes images de services (floues) à supprimer de Firestore lors de l'import. */
export const OLD_IMAGE_IDS = ["seedsvcimportexport", "seedsvcmateriaux", "seedsvcquincaillerie", "seedsvcbois", "seedsvcrevetement", "seedsvcassainissement", "seedsvcmachines"];

/**
 * Séparation personne / entreprise : le profil, le héros et « À propos » parlent uniquement de Delphin GBESSE ;
 * l'entreprise GBEDEL et ses prestations sont présentées dans « Services » et « Organisations ».
 */
const PRESENTATION =
  "Delphin GBESSE, également connu sous le nom de Cherif Deen GBESSE, est conseiller communal de Sô-Ava. Coordonnateur du Bloc Républicain dans l'arrondissement de Ganvié 2, il a été candidat 1er titulaire du Bloc Républicain aux élections communales de janvier 2026.\n\nIl s'engage pour l'amélioration du cadre de vie, le renforcement des infrastructures de base, l'accompagnement des acteurs économiques locaux et la création d'opportunités pour la jeunesse de la commune lacustre de Sô-Ava.";
export const PROFILE_UPDATE: Record<string, unknown> = {
  roles: "Conseiller communal de Sô-Ava · Coordonnateur du Bloc Républicain, Ganvié 2",
  shortBio: "Conseiller communal de Sô-Ava et coordonnateur du Bloc Républicain dans l'arrondissement de Ganvié 2, Delphin GBESSE s'engage pour le développement de la commune lacustre de Sô-Ava, de sa jeunesse et de son économie locale.",
  presentation: PRESENTATION,
  fullBio: PRESENTATION,
  domains: "",
  responsibilities: "Conseiller communal de Sô-Ava ; Coordonnateur du Bloc Républicain, arrondissement de Ganvié 2",
};
export const TEXTS_UPDATE: Record<string, string> = {
  hero_subtitle: "Conseiller communal de Sô-Ava · Coordonnateur du Bloc Républicain, Ganvié 2",
  hero_text: PROFILE_UPDATE.shortBio as string,
};
