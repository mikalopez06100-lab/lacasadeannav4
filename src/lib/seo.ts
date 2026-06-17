import { site } from "@/content/site";

/**
 * Constructeurs de schemas JSON-LD (brief §10).
 * Validés visuellement contre le Rich Results Test avant mise en ligne.
 */

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "InteriorDesigner",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}/assets/brand/logo-black.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    // Pas de restriction géographique — ancrage Haute-Savoie, intervention nationale + internationale.
    areaServed: ["France", "International"],
    priceRange: "€€€",
    foundingDate: String(site.founded),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.proof.googleRating,
      reviewCount: site.proof.googleReviews,
    },
    sameAs: [site.social.instagram, site.social.pinterest],
  };
}

export function foundersSchema() {
  const base = (name: string, jobTitle: string) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    worksFor: { "@type": "Organization", name: site.name, url: site.url },
  });
  return [
    base("Natalia Vastel", "Designer d'intérieur, co-fondatrice"),
    base("Coline Rouvière", "Designer d'intérieur, co-fondatrice"),
  ];
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Sérialise un schema pour injection dans un <script type="application/ld+json">. */
export function jsonLd(schema: object | object[]): string {
  return JSON.stringify(schema);
}
