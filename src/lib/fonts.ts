import { Inter, Josefin_Sans } from "next/font/google";

/**
 * Fonts self-hosted via next/font.
 * Brief client v2 : mêmes typographies que le site de l'architecte partenaire
 * (dreamdesignbuild.fr) — Josefin Sans pour les titres, Inter pour le texte.
 */
export const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400", "600", "700"],
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const fontVariables = `${josefin.variable} ${inter.variable}`;
