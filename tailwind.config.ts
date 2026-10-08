import type { Config } from "tailwindcss";

/**
 * Design tokens — La Casa de Anna · Studio
 * Palette et typographie verrouillées par la charte (brief §3.2 / §3.3).
 * On nomme les tokens : jamais de hex en dur dans les composants.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#efebe3", // fond principal — crème ivoire
        ink: "#0c0a08", // texte principal — encre chaude
        sand: "#e6e0d3", // fond secondaire — sable
        terre: "#5c3a1e", // accent CTA + italiques signature — terre brûlée
        lin: "#94897a", // métadonnées, légendes, placeholders — lin gris
      },
      fontFamily: {
        // Titres, italiques signature, taglines
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        // Corps, navigation, labels, UI
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Échelle éditoriale — fluide via clamp dans globals.css pour les gros titres
        label: ["0.8125rem", { lineHeight: "1.2", letterSpacing: "0.08em" }],
      },
      letterSpacing: {
        label: "0.08em",
        tightish: "-0.02em",
      },
      maxWidth: {
        prose: "68ch",
        content: "1440px",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
