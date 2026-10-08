"use client";

import { useState } from "react";
import { MenuOverlay } from "./MenuOverlay";
import { ContactOverlay } from "@/components/cta/ContactOverlay";

/**
 * Navigation persistante flottante — bas, centrée.
 * Regroupe le déclencheur de Menu (overlay plein écran) et le CTA « Démarrer un projet ».
 * Visible en permanence sur toutes les sections, tous formats.
 */
export function BottomNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Navigation"
        className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-ink/10 bg-cream/80 p-1 pl-1 shadow-[0_10px_40px_rgba(12,10,8,0.14)] backdrop-blur-md"
      >
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="label whitespace-nowrap rounded-full px-5 py-2.5 text-ink/80 transition-colors hover:text-terre"
        >
          Menu
        </button>
        <button
          type="button"
          onClick={() => setCtaOpen(true)}
          className="label whitespace-nowrap rounded-full bg-terre px-5 py-2.5 text-cream transition-colors hover:bg-ink"
        >
          Démarrer un projet
        </button>
      </nav>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <ContactOverlay open={ctaOpen} onClose={() => setCtaOpen(false)} />
    </>
  );
}
