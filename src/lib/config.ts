/**
 * Réglages ponctuels du site (boutique, opérations temporaires).
 * Une seule source pour l'URL de la boutique : à utiliser partout.
 */

/** Boutique en ligne SumUp (mobilier, décoration, cadeaux). */
export const SHOP_URL = "https://la-casa-de-anna.sumupstore.com";

/** Bandeau « Vente de Noël » — affiché tant que la date courante est antérieure à SALE_END. */
// \u2060 (word joiner) et \u00a0 (espace insécable) : ni la date ni l'horaire ne se coupent en fin de ligne
export const SALE_BANNER_TEXT =
  "Vente de Noël · Sélection cadeaux & décoration — Samedi 28 novembre, 10h\u2060–\u206018h · Showroom, 20 chemin du Maltondu, Bluffy";
export const SALE_BANNER_LINK = "Voir la boutique"; // la flèche animée est ajoutée par le bouton
export const SALE_BANNER_TEXT_MOBILE = "Vente de Noël · Sam.\u00a028\u00a0nov., 10h\u2060–\u206018h · Showroom Bluffy";
export const SALE_BANNER_LINK_MOBILE = "Boutique";
export const SALE_END = "2026-11-28T18:00:00+01:00";
