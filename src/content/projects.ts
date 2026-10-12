/**
 * Réalisations. Métadonnées + textes SEO ; les galeries d'images sont résolues
 * depuis le manifest via `imageCategory` (lib/images), pas dupliquées ici.
 *
 * Sélection validée par le client (brief v2, oct. 2026) : projets Notion
 * (Chalet vue lac, Entre lac et montagne, Alpe d'Huez) + anciens projets Wix
 * conservés (Comme à l'hôtel, Menthon). Retirés : Villa Lauflo, Studio, Annecy, Loft Pringy.
 * Textes factuels repris de l'ancien site lacasadeanna.com (Wix).
 */

export type ProjectType =
  | "Résidentiel"
  | "Professionnel"
  | "Mobilier sur mesure";

export type Material = { name: string; note?: string };

export type Project = {
  slug: string;
  title: string;
  location: string;
  area: string; // localité large pour le filtre : Haute-Savoie | Paris | Corse | Autre
  year: number;
  type: ProjectType;
  imageCategory: string; // catégorie dans le manifest d'images
  coverIndex?: number; // image de couverture dans la catégorie (défaut : 0)
  excludeImages?: number[]; // doublons à écarter de la galerie
  excerpt: string;
  body: string[]; // paragraphes (300-500 mots cumulés — SEO)
  materials: Material[];
  testimonial?: { quote: string; author: string };
  featured?: boolean;
  status?: "en-cours"; // affiche un badge « En cours » sur la carte et la fiche
};

export const projects: Project[] = [
  {
    slug: "chalet-vue-lac",
    title: "Chalet vue lac",
    location: "Veyrier-du-Lac",
    area: "Haute-Savoie",
    year: 2024,
    type: "Résidentiel",
    imageCategory: "projects/home-veyrier-du-lac",
    coverIndex: 57, // photo extérieure choisie par Natalia (Notion, oct. 2026)
    excludeImages: [9, 21],
    featured: true,
    excerpt:
      "Un chalet neuf résolument contemporain, qui garde l'âme des chalets anciens de la région, face au lac d'Annecy.",
    body: [
      "Une année de chantier pour une maison neuve au bord du lac d'Annecy. Le cahier des charges était clair dès le départ : une architecture résolument moderne, sans perdre le charme authentique des chalets anciens de la région.",
      "Les grandes baies vitrées cadrent le lac et les montagnes et inondent la pièce de vie de lumière naturelle. Vieux bois, pierre naturelle et métal répondent à des lignes épurées : la chaleur de la matière, la rigueur du dessin.",
      "Nous avons accompagné le projet jusqu'au dernier détail — agencements sur mesure, salles de bains, chambres d'enfants, sélection du mobilier, luminaires et textiles — en coordonnant les artisans sur le chantier.",
      "Le résultat : une maison qui conjugue tradition et modernité, ouverte sur le paysage, où chaque pièce a été pensée pour la vie de famille et pour la lumière du lac.",
    ],
    materials: [
      { name: "Vieux bois", note: "bardages et mobilier" },
      { name: "Pierre naturelle" },
      { name: "Métal noir", note: "menuiseries et détails" },
      { name: "Lin et bouclette", note: "textiles" },
    ],
    testimonial: {
      quote:
        "Natalia et Coline ont compris notre maison avant même que nous sachions la décrire. Le résultat nous ressemble totalement.",
      author: "Famille V., Veyrier-du-Lac",
    },
  },
  // ⚠ Textes de Madrid, Corse et Javea rédigés d'après les visuels (pages Notion sans texte) — à faire valider.
  {
    slug: "madrid",
    title: "Maison à Madrid",
    location: "Madrid, Espagne",
    area: "Autre",
    year: 2026,
    type: "Résidentiel",
    imageCategory: "projects/madrid",
    excerpt:
      "Une maison de plain-pied baignée de soleil : pierre, chêne et enduits clairs, du jardin jusqu'au dressing.",
    body: [
      "À Madrid, cette maison de plain-pied s'ouvre largement sur le jardin et la piscine. Murs de pierre, enduits clairs et grandes baies vitrées composent une architecture lumineuse, pensée pour vivre dehors autant que dedans.",
      "À l'intérieur, le chêne dessine chaque agencement sur mesure : cuisine, dressing, bibliothèque, portes et habillages muraux. La salle de bains s'ouvre sur la végétation, et une cheminée intégrée réchauffe le séjour.",
    ],
    materials: [
      { name: "Pierre sèche", note: "murs extérieurs" },
      { name: "Chêne", note: "agencements sur mesure" },
      { name: "Enduits clairs" },
    ],
  },
  {
    slug: "corse",
    title: "Maison en Corse",
    location: "Corse",
    area: "Corse",
    year: 2026,
    type: "Résidentiel",
    imageCategory: "projects/corse",
    excerpt:
      "Une maison de pierre et d'enduit nichée dans le maquis, aux intérieurs doux et naturels tournés vers la mer.",
    body: [
      "Nichée dans le maquis, cette maison associe la pierre locale à des volumes enduits aux teintes de sable. Les grandes ouvertures cadrent la végétation et la mer.",
      "Les intérieurs jouent la douceur : bois clair, lin, rotin et céramique, une cuisine ouverte sur la salle à manger, des chambres apaisées et des salles de bains aux lignes simples.",
    ],
    materials: [
      { name: "Pierre locale" },
      { name: "Bois clair" },
      { name: "Lin et rotin", note: "textiles et luminaires" },
    ],
  },
  {
    slug: "javea",
    title: "Villa à Jávea",
    location: "Jávea, Espagne",
    area: "Autre",
    year: 2026,
    type: "Résidentiel",
    imageCategory: "projects/javea",
    status: "en-cours",
    excerpt:
      "Une villa méditerranéenne au pied de la montagne, en cours de rénovation : arches blanches, terres cuites et azulejos.",
    body: [
      "Sur la Costa Blanca, cette villa méditerranéenne fait face à la montagne. Arches blanches, sols en terre cuite, escaliers d'azulejos et piscine en mosaïque : le projet, en cours, révèle et prolonge son caractère.",
    ],
    materials: [
      { name: "Terre cuite", note: "sols" },
      { name: "Azulejos" },
      { name: "Enduit à la chaux" },
    ],
  },
  {
    slug: "entre-lac-et-montagne",
    title: "Entre lac et montagne",
    location: "Veyrier-du-Lac",
    area: "Haute-Savoie",
    year: 2023,
    type: "Résidentiel",
    imageCategory: "projects/14-route-de-morat",
    coverIndex: 12,
    featured: true,
    excerpt:
      "Une demeure historique sur trois niveaux, rénovée pour ouvrir chaque pièce sur la vue du lac d'Annecy.",
    body: [
      "Au cœur de Veyrier-du-Lac, cette demeure surplombe le lac d'Annecy. La rénovation mêle charme historique et modernité : chaque pièce a été pensée pour ouvrir la vue sur le lac, comme un tableau qui change au fil des saisons et des heures de la journée.",
      "De vastes verrières font circuler la lumière naturelle entre les espaces et révèlent la charpente ancienne. Les trois niveaux distinguent nettement les espaces de vie, de repos et de jeu, tout en optimisant chaque mètre carré.",
      "Palette douce, bois clair, bleu profond et matières naturelles : chaque pièce raconte une histoire, avec des touches personnelles qui rendent la maison unique. Isolation acoustique et thermique ont été revues pour un confort en toute saison.",
    ],
    materials: [
      { name: "Charpente ancienne", note: "conservée et révélée" },
      { name: "Chêne clair", note: "sols" },
      { name: "Verrières acier" },
      { name: "Bleu profond", note: "murs du séjour" },
    ],
  },
  {
    slug: "alpe-d-huez",
    title: "Appartement à l'Alpe d'Huez",
    location: "Alpe d'Huez",
    area: "Autre",
    year: 2026,
    type: "Résidentiel",
    imageCategory: "projects/alpe-d-huez",
    excerpt:
      "Un appartement de station entièrement repensé : bois, damier et lumière douce pour un refuge chaleureux.",
    body: [
      "Un appartement de station repensé pour vivre la montagne en douceur. Bardage bois du sol au plafond, banquettes sur mesure habillées de damier, lits superposés intégrés pour les enfants : chaque mètre carré est optimisé sans rien sacrifier au confort.",
      "Les luminaires sculpturaux, les textiles bouclés et les touches de vert forêt apportent une écriture contemporaine à l'esprit chalet. Affiches et objets chinés racontent la montagne avec humour.",
    ],
    materials: [
      { name: "Bardage bois" },
      { name: "Damier tissé", note: "banquettes sur mesure" },
      { name: "Bouclette", note: "assises" },
      { name: "Vert forêt", note: "touches textiles" },
    ],
  },
  {
    slug: "comme-a-l-hotel",
    title: "Comme à l'hôtel",
    location: "Rive est du lac d'Annecy",
    area: "Haute-Savoie",
    year: 2023,
    type: "Résidentiel",
    imageCategory: "projects/comme-a-l-hotel",
    excerpt:
      "Une petite maisonnette au bord du lac, transformée en duplex à l'esprit chambre d'hôtel.",
    body: [
      "Sur la rive est du lac d'Annecy, cette petite maisonnette a demandé de gros travaux de rénovation. Chaque recoin a été dessiné pour optimiser l'espace et créer un lieu à la fois fonctionnel et chaleureux.",
      "Pour agrandir visuellement les volumes, nous avons fait poser un papier peint panoramique Isidore Leroy (Les Cimes). Un meuble sur mesure en chêne massif, dessiné par le studio, fait à la fois office d'escalier, de tête de lit et de bibliothèque.",
    ],
    materials: [
      { name: "Chêne massif", note: "meuble escalier-bibliothèque sur mesure" },
      { name: "Papier peint panoramique", note: "Isidore Leroy — Les Cimes" },
    ],
  },
  {
    slug: "menthon-saint-bernard",
    title: "Sous les combles",
    location: "Menthon-Saint-Bernard",
    area: "Haute-Savoie",
    year: 2023,
    type: "Résidentiel",
    imageCategory: "projects/menthon-saint-bernard",
    excerpt:
      "Des combles inutilisés transformés en suite parentale et salle de jeux, face au château de Menthon.",
    body: [
      "Au départ, il n'y avait que des poutres et un plancher. Nous avons transformé ces combles inutilisés en un étage de vie lumineux, avec vue sur le château de Menthon-Saint-Bernard.",
      "Des fenêtres de toit placées avec soin font entrer la lumière. Sous la charpente apparente, la chambre parentale s'ouvre par une verrière sur mesure qui préserve l'atmosphère ouverte de l'espace. Parquet chêne et teintes claires modernisent sans effacer le caractère de la maison.",
      "Une salle de jeux et des rangements intégrés complètent l'étage, desservi par un escalier dessiné pour s'harmoniser avec le reste de la maison.",
    ],
    materials: [
      { name: "Parquet chêne" },
      { name: "Verrière sur mesure" },
      { name: "Charpente apparente" },
    ],
  },
  {
    slug: "rideaux-banquettes-sur-mesure",
    title: "Rideaux & banquettes sur mesure",
    location: "Haute-Savoie",
    area: "Haute-Savoie",
    year: 2024,
    type: "Mobilier sur mesure",
    imageCategory: "projects/rideaux",
    excerpt:
      "Le savoir-faire confection du studio — rideaux, voilages et banquettes dessinés et fabriqués sur mesure.",
    body: [
      "La confection est un métier à part entière du studio. Rideaux, voilages, stores et banquettes sont dessinés sur mesure puis fabriqués pour s'ajuster exactement aux fenêtres, aux volumes et à la lumière de chaque pièce.",
      "Le choix des tissus — lin lavé, velours côtelé, cotons épais — se fait main dans la main avec les clients, selon l'usage, la tombée recherchée et la lumière de la pièce. Chaque réalisation est unique : ourlets, doublures, têtes de rideau et finitions sont travaillés dans le détail.",
      "Ce savoir-faire de confection s'intègre naturellement aux projets clé-en-main, mais peut aussi être commandé seul, partout en France. C'est l'une des signatures les plus reconnaissables de La Casa de Anna.",
    ],
    materials: [
      { name: "Lin lavé" },
      { name: "Velours côtelé écru" },
      { name: "Coton épais" },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
