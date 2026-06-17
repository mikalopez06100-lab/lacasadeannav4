/**
 * Le duo (brief §10 : Schema Person + page studio). Bios à valider/affiner par le studio.
 * Images : catégorie "team" du manifest (14 photos du shooting janv. 2025 © Pierre Maullet).
 */

export type Member = { name: string; role: string; bio: string };

export const team: Member[] = [
  {
    name: "Natalia Vastel",
    role: "Co-fondatrice · Designer d'intérieur",
    bio: "Natalia fonde La Casa de Anna en 2021, du nom de sa fille Anna. Œil éditorial et sens aigu des matières, elle compose des intérieurs où chaque détail a une raison d'être. Elle pilote la vision artistique des projets, de la première intention au dernier coussin.",
  },
  {
    name: "Coline Rouvière",
    role: "Co-fondatrice · Designer d'intérieur",
    bio: "Coline conçoit, dessine et orchestre la réalisation des projets. Rigueur du suivi de chantier, exigence sur le mobilier sur mesure et la confection : elle veille à ce que l'idée juste devienne un lieu habité, sans compromis sur l'exécution.",
  },
];

export const studioIntro = {
  label: "Le studio",
  heading: "Un duo, une exigence",
  text: "Natalia Vastel et Coline Rouvière forment La Casa de Anna — un studio de design d'intérieur ancré au bord du lac d'Annecy, mais sans frontières. Ensemble, elles conçoivent des intérieurs sur mesure : conception, mobilier, rideaux confectionnés et suivi de chantier, en Haute-Savoie comme partout où un projet les appelle.",
};
