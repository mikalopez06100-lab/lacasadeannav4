/**
 * Journal (brief §10 : 5 articles minimum, Schema Article).
 * Contenu SEO/GEO : conseils, making-of, matières. Mots-clés géo intégrés naturellement.
 * Textes de lancement à enrichir par le studio au fil de l'eau.
 */

export type Article = {
  slug: string;
  title: string;
  date: string; // ISO
  category: "Conseils" | "Matières" | "Making-of" | "Inspiration";
  excerpt: string;
  body: string[];
};

/** Visuel de couverture par article (catégorie + index dans le manifest d'images). */
export const articleImage: Record<string, { category: string; index: number }> = {
  "choisir-architecte-interieur-annecy": { category: "projects/home-veyrier-du-lac", index: 30 },
  "matieres-naturelles-interieur-alpin": { category: "projects/home-veyrier-du-lac", index: 6 },
  "rideaux-sur-mesure-savoir-faire": { category: "projects/rideaux", index: 2 },
  "renovation-complete-par-ou-commencer": { category: "projects/14-route-de-morat", index: 6 },
  "quiet-luxury-interieur-definition": { category: "projects/veyrier-lauflo", index: 4 },
};

export const journal: Article[] = [
  {
    slug: "choisir-architecte-interieur-annecy",
    title: "Comment choisir son architecte d'intérieur à Annecy",
    date: "2026-05-12",
    category: "Conseils",
    excerpt:
      "Budget, méthode, feeling : les bons critères pour confier votre intérieur à un studio de design en Haute-Savoie.",
    body: [
      "Choisir un architecte ou un décorateur d'intérieur à Annecy ne se résume pas à comparer des devis. C'est avant tout une rencontre : la personne qui va dessiner votre lieu de vie doit comprendre votre quotidien, vos contraintes et votre rapport aux matières.",
      "Premier critère : la méthode. Un bon studio commence par une phase d'écoute — une consultation — avant de proposer quoi que ce soit. Méfiez-vous des projets dessinés sans avoir vu vos volumes ni compris votre lumière.",
      "Deuxième critère : la cohérence du portfolio. Regardez si les réalisations partagent une exigence commune sans tomber dans la signature imposée. Un studio à l'écoute adapte son vocabulaire à chaque client plutôt que de répéter la même recette.",
      "Enfin, le périmètre. À La Casa de Anna, nous sommes ancrés à Veyrier-du-Lac mais nous intervenons partout — à Annecy, en Haute-Savoie, à Paris ou en Corse. La distance n'est pas un obstacle quand la méthode est rodée.",
    ],
  },
  {
    slug: "matieres-naturelles-interieur-alpin",
    title: "Cinq matières naturelles pour un intérieur alpin juste",
    date: "2026-04-03",
    category: "Matières",
    excerpt:
      "Chêne, lin, pierre calcaire, ardoise, laiton : notre palette de matières et comment les associer.",
    body: [
      "La matière est le cœur de notre travail. Plutôt que la couleur, c'est elle qui donne le ton d'un intérieur et qui détermine comment il vieillira. Voici les cinq matières que nous privilégions pour un quiet luxury ancré dans la lumière du lac d'Annecy.",
      "Le chêne massif, d'abord, pour les sols et le mobilier sur mesure : chaleureux, vivant, il se patine avec le temps. Le lin écru ensuite, pour les rideaux confectionnés — il filtre la lumière sans l'éteindre.",
      "La pierre calcaire et le travertin apportent une fraîcheur minérale aux plans et aux salles d'eau. L'ardoise mate, plus sombre, structure les pièces humides. Enfin le laiton patiné, en touches : poignées, robinetterie, luminaires.",
      "Le secret n'est pas d'accumuler ces matières mais de les laisser dialoguer, dans une palette terreuse et sourde. C'est cette retenue qui fait la différence entre un intérieur démonstratif et un intérieur juste.",
    ],
  },
  {
    slug: "rideaux-sur-mesure-savoir-faire",
    title: "Rideaux sur mesure : pourquoi la confection change tout",
    date: "2026-03-08",
    category: "Making-of",
    excerpt:
      "Tombée, doublure, tête de rideau : ce que le sur-mesure apporte qu'un rideau standard ne donnera jamais.",
    body: [
      "Un rideau confectionné sur mesure n'a rien à voir avec un modèle standard. La différence se joue dans des détails invisibles qui changent tout : la tombée du tissu, le choix de la doublure, la tête de rideau, l'ourlet lesté.",
      "Tout commence par le tissu. Lin lavé pour une tombée souple, velours côtelé pour la chaleur, coton épais pour occulter : chaque matière a un comportement, et le bon choix dépend de l'usage et de la lumière de la pièce.",
      "Vient ensuite la prise de mesures, au millimètre, pour que le rideau habille exactement la fenêtre. Puis la confection en atelier, où chaque finition est travaillée à la main.",
      "C'est l'une des signatures de La Casa de Anna : un savoir-faire de confection que nous proposons dans nos projets complets, mais aussi seul, partout en France.",
    ],
  },
  {
    slug: "renovation-complete-par-ou-commencer",
    title: "Rénovation complète : par où commencer ?",
    date: "2026-02-14",
    category: "Conseils",
    excerpt:
      "Les étapes clés d'une rénovation réussie, de la première visite au dernier coussin.",
    body: [
      "Se lancer dans une rénovation complète peut intimider. La clé est de procéder dans le bon ordre — et de ne pas dessiner avant d'avoir compris.",
      "La première étape est toujours l'observation : comment la lumière traverse les pièces, comment vous vivez l'espace, ce qui fonctionne et ce qui coince. C'est l'objet de notre consultation.",
      "Vient ensuite la conception : plans, matières, mobilier, lumière, réunis dans un dossier cohérent. Cette phase évite les erreurs coûteuses sur le chantier.",
      "Puis la réalisation, où la coordination des artisans fait toute la différence, et enfin la livraison — la mise en scène finale, jusqu'au dernier détail. Un bon studio vous accompagne sur toute cette chaîne.",
    ],
  },
  {
    slug: "quiet-luxury-interieur-definition",
    title: "Le quiet luxury en décoration : luxe du silence",
    date: "2026-01-20",
    category: "Inspiration",
    excerpt:
      "Ni démonstratif ni minimaliste froid : ce que veut dire, pour nous, un intérieur de quiet luxury.",
    body: [
      "Le quiet luxury est devenu un mot à la mode, souvent mal compris. Pour nous, ce n'est ni le minimalisme froid ni l'accumulation de matériaux nobles. C'est une affaire de retenue.",
      "Un intérieur de quiet luxury ne cherche pas à impressionner. Il choisit des matières naturelles qui vieillissent bien, une palette sourde, des proportions justes. Le luxe est dans le silence : l'absence de ce qui crie.",
      "C'est aussi un luxe d'usage. Un canapé profond, une lumière douce le soir, un rangement pensé pour votre quotidien valent plus qu'un objet spectaculaire mal vécu.",
      "Ancré dans la lumière du lac d'Annecy et les matières alpines, c'est l'intérieur que nous aimons composer : discret, durable, profondément habitable.",
    ],
  },
];

export function getArticle(slug: string) {
  return journal.find((a) => a.slug === slug);
}
