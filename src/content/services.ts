/**
 * Prestations (brief §8 / page prestations). 6 formules.
 * Prix formule 02 (Dossier) et 03 (Clé-en-main) en attente client → null = « Sur devis ».
 */

export type Service = {
  id: string;
  index: string;
  name: string;
  price: string | null; // null → « Sur devis »
  duration?: string;
  description: string;
  deliverables: string[];
  cta: { label: string; href: string };
  highlight?: boolean;
};

export const services: Service[] = [
  {
    id: "consultation",
    index: "01",
    name: "Consultation",
    price: "790 €",
    duration: "3 heures",
    description:
      "Une séance de travail de trois heures, à domicile ou en visio, pour comprendre votre espace, votre vie et votre budget. Vous repartez avec des premiers choix concrets et une direction claire.",
    deliverables: [
      "Lecture des volumes et de la lumière",
      "Premières pistes d'aménagement",
      "Conseils matières et couleurs",
      "Estimation budgétaire indicative",
    ],
    cta: { label: "Réserver une consultation", href: "/contact" },
    highlight: true,
  },
  {
    id: "dossier-conception",
    index: "02",
    name: "Dossier de conception",
    price: null,
    description:
      "Un dossier complet pour conduire vos travaux sereinement : plans, matières, mobilier, lumière. Tout est pensé, rien n'est laissé au hasard. Vous pilotez la réalisation avec un document de référence.",
    deliverables: [
      "Plans d'aménagement et d'implantation",
      "Planches matières et coloris",
      "Sélection mobilier et luminaires",
      "Plan d'éclairage détaillé",
    ],
    cta: { label: "Demander un devis", href: "/contact" },
  },
  {
    id: "cle-en-main",
    index: "03",
    name: "Clé-en-main",
    price: null,
    description:
      "Le studio prend en charge l'intégralité du projet, de la conception à la livraison. Nous coordonnons les artisans, suivons le chantier et vérifions chaque détail jusqu'au dernier coussin posé.",
    deliverables: [
      "Conception complète",
      "Coordination des artisans",
      "Suivi de chantier rigoureux",
      "Mise en scène et livraison finale",
    ],
    cta: { label: "Démarrer un projet", href: "/contact" },
    highlight: true,
  },
  {
    id: "mobilier-sur-mesure",
    index: "04",
    name: "Mobilier sur mesure",
    price: null,
    description:
      "Banquettes, bibliothèques, têtes de lit, rangements : nous dessinons votre mobilier et le faisons fabriquer par des artisans de confiance, ajusté à vos volumes au millimètre.",
    deliverables: [
      "Dessins et plans techniques",
      "Choix des essences et finitions",
      "Fabrication artisanale",
      "Installation soignée",
    ],
    cta: { label: "Parler de mon projet", href: "/contact" },
  },
  {
    id: "rideaux-confection",
    index: "05",
    name: "Rideaux & banquettes confectionnés",
    price: null,
    description:
      "Notre savoir-faire de confection : rideaux, voilages, stores et banquettes sur mesure, dessinés et fabriqués pour s'ajuster exactement à chaque fenêtre et chaque lumière. Disponible partout en France.",
    deliverables: [
      "Conseil tissus et tombée",
      "Prise de mesures",
      "Confection sur mesure",
      "Pose et finitions",
    ],
    cta: { label: "Demander un devis", href: "/contact" },
  },
  {
    id: "projets-professionnels",
    index: "06",
    name: "Projets professionnels",
    price: null,
    description:
      "Hôtels, restaurants, boutiques, bureaux : nous concevons des lieux qui racontent une marque et accueillent ses clients. Une approche éditoriale au service de l'expérience.",
    deliverables: [
      "Concept et direction artistique",
      "Aménagement et mobilier",
      "Identité matières et lumière",
      "Suivi de réalisation",
    ],
    cta: { label: "Échanger sur le projet", href: "/contact" },
  },
];
