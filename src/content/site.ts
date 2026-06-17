/**
 * Source de vérité unique — identité, NAP, réseaux, architecture marque mère.
 * Tout composant / schema JSON-LD lit ici. Aucun de ces faits n'est dupliqué ailleurs.
 */

export const site = {
  name: "La Casa de Anna",
  // Nom de marque personnelle : « Anna » est la fille de Natalia, pas une fondatrice.
  tagline: "Studio de design d'intérieur",
  // Périmètre : ancrage Haute-Savoie, intervention France + international. NE PAS restreindre.
  description:
    "Studio de design d'intérieur sur mesure fondé par Natalia Vastel et Coline Rouvière. Consultation, conception, clé-en-main, mobilier sur mesure et rideaux confectionnés. Ancré à Veyrier-du-Lac, au bord du lac d'Annecy — projets partout en France et à l'international.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lacasadeanna.com",
  email: "decoration@lacasadeanna.com",
  phone: "+33661243036",
  phoneDisplay: "06 61 24 30 36",
  address: {
    street: "38A route de Morat",
    city: "Veyrier-du-Lac",
    postalCode: "74290",
    region: "Haute-Savoie",
    country: "FR",
  },
  founded: 2021,
  social: {
    instagram: "https://www.instagram.com/la_casa_de_anna/",
    instagramHandle: "@la_casa_de_anna",
    pinterest: "https://fr.pinterest.com/La_casa_de_Anna/",
  },
  proof: {
    instagramFollowers: "34 K",
    googleRating: 5.0,
    googleReviews: 16,
    press: "Art & Décoration",
  },
  // Lien de réservation (Cal.com / Google Calendar) — direct, pas de widget.
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "/contact",
} as const;

/**
 * Architecture marque mère (brief DA §2, tension n°3).
 * Le site Maison (mobilier) n'est pas encore construit (inputs client bloquants),
 * mais le cross-link est prêt : on n'aura pas à refondre quand il arrivera.
 */
export const sites = {
  studio: {
    id: "studio",
    label: "Studio",
    domain: "lacasadeanna.com",
    url: process.env.NEXT_PUBLIC_STUDIO_URL ?? "https://www.lacasadeanna.com",
    live: true,
  },
  maison: {
    id: "maison",
    label: "Maison",
    domain: "mobilier.lacasadeanna.com",
    url:
      process.env.NEXT_PUBLIC_MAISON_URL ?? "https://mobilier.lacasadeanna.com",
    live: false, // ⏳ en attente du cadrage client (statut marques, modèle, nommage)
  },
} as const;

export const nav = [
  { label: "Studio", href: "/studio" },
  { label: "Prestations", href: "/prestations" },
  { label: "Réalisations", href: "/realisations" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
] as const;

/** Communes Haute-Savoie à densifier naturellement dans les textes (brief §10). */
export const geoKeywords = [
  "Annecy",
  "Veyrier-du-Lac",
  "Annecy-le-Vieux",
  "Talloires",
  "Menthon-Saint-Bernard",
  "Faverges",
  "Thônes",
  "Megève",
] as const;
