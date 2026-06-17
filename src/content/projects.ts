/**
 * Réalisations. Métadonnées + textes SEO ; les galeries d'images sont résolues
 * depuis le manifest via `imageCategory` (lib/images), pas dupliquées ici.
 *
 * 4 projets réellement photographiés. Le brief en vise 6 → 2 restent à shooter
 * (point critique du brief DA : « sans nouvelles photos, on plafonne à 60 % »).
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
  excerpt: string;
  body: string[]; // paragraphes (300-500 mots cumulés — SEO)
  materials: Material[];
  testimonial?: { quote: string; author: string };
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "maison-veyrier-du-lac",
    title: "Maison au bord du lac",
    location: "Veyrier-du-Lac",
    area: "Haute-Savoie",
    year: 2024,
    type: "Résidentiel",
    imageCategory: "projects/home-veyrier-du-lac",
    featured: true,
    excerpt:
      "Rénovation complète d'une maison familiale face au lac d'Annecy — repenser chaque volume autour de la lumière.",
    body: [
      "À Veyrier-du-Lac, cette maison familiale ouvrait sur l'un des plus beaux points de vue du lac d'Annecy, sans jamais vraiment l'exploiter. Le premier travail a été de redessiner la circulation : effacer des cloisons, élargir les ouvertures, laisser la lumière du lac traverser les pièces de vie du matin au soir.",
      "Nous avons construit l'intérieur autour de matières naturelles qui dialoguent avec le paysage — chêne massif pour les sols et le mobilier sur mesure, lin écru pour les rideaux confectionnés en atelier, pierre calcaire pour les plans et les seuils. Rien de démonstratif : une palette terreuse et chaude qui laisse la vue et la lumière mener la composition.",
      "Le mobilier a été dessiné pièce par pièce — banquettes sur mesure, bibliothèque intégrée, têtes de lit en bois — puis fabriqué par des artisans de Haute-Savoie avec qui le studio travaille de longue date. Chaque détail, des poignées en laiton patiné aux finitions de menuiserie, a été suivi sur le chantier.",
      "Le résultat est un intérieur qui ne cherche pas à impressionner mais à accueillir : un lieu de famille, calme et juste, où chaque matière a été choisie pour vieillir bien. C'est notre définition du quiet luxury — discret, ancré, durable.",
    ],
    materials: [
      { name: "Chêne massif", note: "sols et mobilier sur mesure" },
      { name: "Lin écru", note: "rideaux confectionnés" },
      { name: "Pierre calcaire", note: "plans et seuils" },
      { name: "Laiton patiné", note: "poignées et détails" },
    ],
    testimonial: {
      quote:
        "Natalia et Coline ont compris notre maison avant même que nous sachions la décrire. Le résultat nous ressemble totalement.",
      author: "Famille V., Veyrier-du-Lac",
    },
  },
  {
    slug: "appartement-route-de-morat",
    title: "Appartement, route de Morat",
    location: "Annecy",
    area: "Haute-Savoie",
    year: 2023,
    type: "Résidentiel",
    imageCategory: "projects/14-route-de-morat",
    featured: true,
    excerpt:
      "Un appartement annécien repensé comme un écrin chaleureux — gagner en confort sans alourdir l'espace.",
    body: [
      "Cet appartement d'Annecy demandait une lecture nouvelle : des volumes corrects mais cloisonnés, une lumière sous-exploitée, des matériaux datés. L'enjeu était de gagner en confort et en chaleur sans jamais charger l'espace.",
      "Nous avons retravaillé les sols, les éclairages et les rangements intégrés pour libérer la perception de l'espace. Une palette de tons chauds — bois clair, textiles naturels, touches de terre brûlée — réchauffe l'ensemble tout en gardant la sobriété recherchée.",
      "Le mobilier sur mesure structure les pièces sans les encombrer : assises basses, rangements toute hauteur, séparations claire-voie qui laissent passer la lumière. Les rideaux, confectionnés sur mesure, habillent les fenêtres d'un lin qui filtre la lumière sans l'éteindre.",
      "Comme pour chaque projet, le studio a coordonné les artisans et suivi le chantier dans le détail, jusqu'au dernier coussin posé. Un appartement transformé en lieu de vie enveloppant, à l'image de ses habitants.",
    ],
    materials: [
      { name: "Bois clair" },
      { name: "Lin naturel", note: "rideaux sur mesure" },
      { name: "Terre brûlée", note: "touches textiles" },
    ],
  },
  {
    slug: "villa-lauflo",
    title: "Villa Lauflo",
    location: "Veyrier-du-Lac",
    area: "Haute-Savoie",
    year: 2024,
    type: "Résidentiel",
    imageCategory: "projects/veyrier-lauflo",
    excerpt:
      "Décoration et mise en scène d'une villa contemporaine — la justesse des matières au service du paysage.",
    body: [
      "Pour cette villa contemporaine de Veyrier-du-Lac, l'architecture était déjà belle ; il fallait l'habiter. Le studio est intervenu sur la décoration et la mise en scène des espaces, en respectant les lignes existantes.",
      "Le parti pris : des matières naturelles et une palette sourde qui prolongent le paysage alpin à l'intérieur. Mobilier choisi avec soin, textiles confectionnés, objets sélectionnés un à un — chaque pièce trouve sa place sans surcharge.",
      "Le travail de la lumière, naturelle comme artificielle, structure les ambiances au fil de la journée. L'ensemble compose un intérieur élégant et apaisé, où rien ne crie et où tout s'accorde.",
    ],
    materials: [
      { name: "Chêne" },
      { name: "Textiles naturels" },
      { name: "Céramique" },
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
