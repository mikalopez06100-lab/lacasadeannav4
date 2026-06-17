"use client";

import { useEffect, useRef, useState } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { ContactForm } from "./ContactForm";

/**
 * CTA persistant « Démarrer un projet » (brief §4.5, inspiré Studio X + Fluid Glass).
 * Bouton sticky haut-droite + overlay plein écran en clip-path circle depuis le coin.
 * C'est le pivot de conversion du site — visible sur toutes les sections.
 */
export function ProjectCTA() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Animation d'ouverture/fermeture (no-op gracieux si reduced-motion → on bascule l'état CSS).
  useEffect(() => {
    registerGsap();
    const el = overlayRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const closed = "circle(0% at calc(100% - 2rem) 2rem)";
    const opened = "circle(150% at calc(100% - 2rem) 2rem)";

    if (reduce) {
      el.style.clipPath = open ? opened : closed;
      return;
    }

    gsap.to(el, {
      clipPath: open ? opened : closed,
      duration: open ? 0.7 : 0.5,
      ease: "power3.inOut",
    });
  }, [open]);

  // Verrouille le scroll body + Échap pour fermer
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="label fixed right-5 top-5 z-50 bg-terre px-5 py-3 text-cream transition-colors duration-300 ease-soft hover:bg-ink md:right-6 md:top-6"
      >
        Démarrer un projet
      </button>

      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Démarrer un projet"
        aria-hidden={!open}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-ink text-cream"
        style={{ clipPath: "circle(0% at calc(100% - 2rem) 2rem)" }}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="label absolute right-5 top-5 z-10 text-cream md:right-6 md:top-6"
        >
          Fermer ×
        </button>
        <div className="container-x w-full max-w-2xl">
          {open && <ContactForm onSuccess={() => setOpen(false)} />}
        </div>
      </div>
    </>
  );
}
