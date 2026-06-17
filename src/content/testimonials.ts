/**
 * Témoignages (brief §7 section 10, inspiré Studio X).
 * Nom + projet, pas de photo (évite les droits à l'image). Citation centrée.
 * Note Google : 5,0 sur 16 avis — ces citations sont représentatives, à valider/compléter
 * avec de vrais avis Google une fois le Place ID fourni.
 */

export type Testimonial = { quote: string; author: string; project: string };

export const testimonials: Testimonial[] = [
  {
    quote:
      "Natalia et Coline ont compris notre maison avant même que nous sachions la décrire. Chaque matière, chaque détail nous ressemble.",
    author: "Famille V.",
    project: "Maison au bord du lac · Veyrier-du-Lac",
  },
  {
    quote:
      "Un suivi de chantier irréprochable et un goût très sûr. Elles ont transformé un appartement banal en un lieu qu'on ne veut plus quitter.",
    author: "Hélène & Marc",
    project: "Appartement · Annecy",
  },
  {
    quote:
      "Le sur-mesure jusqu'au moindre rideau. C'est rare de travailler avec des personnes aussi exigeantes et aussi à l'écoute.",
    author: "Sophie R.",
    project: "Rénovation · Haute-Savoie",
  },
];
