/**
 * Collaborations — partenaires qui partagent les bureaux de Bluffy (brief client v2).
 * Liens fournis par le client. Le 4e bloc renvoie vers le futur site mobilier
 * (content/site.ts → sites.maison), ou vers le showroom tant qu'il n'est pas en ligne.
 */

export type Collaboration = {
  name: string;
  role: string;
  url: string;
  logo: { src: string; width: number; height: number };
};

export const collaborations: Collaboration[] = [
  {
    name: "NC Design Studio",
    role: "Conception & construction",
    url: "https://dreamdesignbuild.fr/case-studies",
    logo: { src: "/assets/img/partners/nc-design-studio.webp", width: 377, height: 200 },
  },
  {
    name: "Arbolya",
    role: "Paysagiste",
    url: "https://arbolya.fr/",
    logo: { src: "/assets/img/partners/arbolya.webp", width: 219, height: 200 },
  },
  {
    name: "Paula. Architecture",
    role: "Architecte",
    url: "https://paulaarchitecture.com/projets",
    logo: { src: "/assets/img/partners/paula-architecture.webp", width: 520, height: 188 },
  },
];
