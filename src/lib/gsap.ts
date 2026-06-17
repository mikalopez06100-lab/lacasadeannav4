"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

/**
 * Enregistrement des plugins GSAP — UNE SEULE FOIS pour toute l'app
 * (checklist brief §14 : éviter les doubles registrations).
 *
 * GSAP est désormais 100 % gratuit (ScrollTrigger, Draggable, SplitText inclus).
 * On garde malgré tout un split de lignes maison pour le contrôle SSR (voir TextReveal).
 */
let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, Draggable);
  registered = true;
}

/**
 * Wrapper reduced-motion (brief §14).
 * Toute animation décorative passe par ce helper : si l'utilisateur a demandé
 * moins de mouvement, on n'exécute pas l'animation et on laisse le contenu visible.
 */
export function withMotion(setup: (gsapInstance: typeof gsap) => void) {
  registerGsap();
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    setup(gsap);
  });
  return () => mm.revert();
}

export { gsap, ScrollTrigger, Draggable };
