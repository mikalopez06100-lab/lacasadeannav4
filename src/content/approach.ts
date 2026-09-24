/** Approche — process en 4 étapes numérotées (brief §7 section 05, inspiré Studio X). */

export type Step = { index: string; title: string; description: string };

export const approach: Step[] = [
  {
    index: "01",
    title: "Le rendez-vous déco",
    description:
      "Une consultation de 3 h pour comprendre votre espace, votre vie, votre budget.",
  },
  {
    index: "02",
    title: "Dossier de conception",
    description:
      "Un dossier complet : plans, matières, mobilier, lumière. Rien n'est laissé au hasard.",
  },
  {
    index: "03",
    title: "Réalisation",
    description:
      "Nous coordonnons les artisans et vérifions chaque détail — pour un résultat fidèle aux plans.",
  },
  {
    index: "04",
    title: "Livraison",
    description:
      "De la pièce vide au dernier coussin posé — un intérieur qui vous ressemble vraiment.",
  },
];
