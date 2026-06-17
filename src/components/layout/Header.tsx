"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { cn } from "@/lib/utils";
import { MenuOverlay } from "./MenuOverlay";

/**
 * Nav fixe (brief §6). Logo pictogramme à gauche, items au centre (desktop),
 * burger (mobile) → menu plein écran. Fond transparent, backdrop-blur léger au scroll.
 * Le CTA « Démarrer un projet » est un élément sticky distinct (ProjectCTA).
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "container-x fixed inset-x-0 top-0 z-40 flex items-center py-4 transition-colors duration-300",
          scrolled && "bg-cream/70 backdrop-blur-sm",
        )}
      >
        {/* Gauche : burger (mobile) / logo (desktop) */}
        <div className="flex flex-1 items-center">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="label flex items-center gap-2 md:hidden"
          >
            <span className="flex flex-col gap-[3px]">
              <span className="h-px w-5 bg-ink" />
              <span className="h-px w-5 bg-ink" />
            </span>
            Menu
          </button>

          <Link
            href="/"
            aria-label="La Casa de Anna — accueil"
            className="hidden shrink-0 md:block"
          >
            <Image
              src="/assets/brand/pictogram-black.webp"
              alt="La Casa de Anna"
              width={44}
              height={44}
              priority
              className="h-9 w-auto"
            />
          </Link>
        </div>

        {/* Centre : nav (desktop uniquement) */}
        <nav
          className="hidden gap-8 md:flex"
          aria-label="Navigation principale"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label text-ink/80 transition-colors hover:text-terre"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Droite : espace réservé — le CTA « Démarrer un projet » y flotte (fixed) */}
        <div className="flex flex-1 justify-end" aria-hidden="true" />
      </header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
