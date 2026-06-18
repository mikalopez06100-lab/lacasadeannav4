"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { ContactForm } from "./ContactForm";

/**
 * Overlay « Démarrer un projet » contrôlé (ouvert/fermé par BottomNav).
 * Clip-path circle depuis le bas-centre — origine alignée sur la barre persistante.
 */
export function ContactOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const closed = "circle(0% at 50% 100%)";
    const opened = "circle(150% at 50% 100%)";

    if (reduce) {
      el.style.clipPath = open ? opened : closed;
    } else {
      gsap.to(el, {
        clipPath: open ? opened : closed,
        duration: open ? 0.7 : 0.5,
        ease: "power3.inOut",
      });
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Démarrer un projet"
      aria-hidden={!open}
      data-cursor-dark
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink text-cream"
      style={{ clipPath: "circle(0% at 50% 100%)" }}
    >
      <button
        type="button"
        onClick={onClose}
        className="label absolute right-5 top-5 z-10 text-cream md:right-8 md:top-8"
      >
        Fermer ×
      </button>
      <div className="container-x w-full max-w-2xl">
        {open && <ContactForm onSuccess={onClose} />}
      </div>
    </div>
  );
}
