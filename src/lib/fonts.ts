import { Bricolage_Grotesque, Fraunces } from "next/font/google";

/**
 * Fonts variables self-hosted via next/font (brief §3.3).
 *
 * IMPORTANT — on charge les AXES variables, pas des poids figés.
 * Figer `weight` désactive les axes opsz/SOFT/WONK : or `WONK=1` est la
 * signature typographique du projet (italiques d'accroche). On garde donc
 * la plage variable complète + les axes nécessaires.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz", "wdth"],
});

export const fontVariables = `${fraunces.variable} ${bricolage.variable}`;
