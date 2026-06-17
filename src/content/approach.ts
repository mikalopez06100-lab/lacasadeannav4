/** Approche — process en 4 étapes numérotées (brief §7 section 05, inspiré Studio X). */

export type Step = { index: string; title: string; description: string };

export const approach: Step[] = [
  {
    index: "01",
    title: "Rencontre",
    description:
      "Une consultation de 3 h pour comprendre votre espace, votre vie, votre budget.",
  },
  {
    index: "02",
    title: "Conception",
    description:
      "Un dossier complet : plans, matières, mobilier, lumière. Rien n'est laissé au hasard.",
  },
  {
    index: "03",
    title: "Réalisation",
    description:
      "Un suivi de chantier rigoureux. Nous coordonnons les artisans, nous vérifions chaque détail.",
  },
  {
    index: "04",
    title: "Livraison",
    description:
      "De la pièce vide au dernier coussin posé — un intérieur qui vous ressemble vraiment.",
  },
];
