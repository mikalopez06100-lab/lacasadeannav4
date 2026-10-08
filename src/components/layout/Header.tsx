"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Header — logo complet « La Casa de Anna » centré en haut (mot-symbole lisible).
 * La navigation (Menu) et le CTA (Démarrer un projet) vivent désormais dans la
 * barre persistante flottante en bas (BottomNav).
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  // Sur l'accueil, le logo passe en blanc tant qu'il est posé sur la photo du hero
  const overHero = usePathname() === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex items-center justify-center py-5 transition-colors duration-300",
        scrolled && "bg-cream/70 backdrop-blur-sm",
      )}
    >
      <Link href="/" aria-label="La Casa de Anna — accueil" className="block">
        <Image
          src={overHero ? "/assets/brand/logo-white.webp" : "/assets/brand/logo-black.webp"}
          alt="La Casa de Anna"
          width={428}
          height={200}
          priority
          className="h-14 w-auto md:h-16"
        />
      </Link>
    </header>
  );
}
