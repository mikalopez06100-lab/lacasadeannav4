"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { withMotion } from "@/lib/gsap";

/**
 * Transition matière inter-sections (brief §4.3, inspiré Mersi).
 * Bandeau plein écran qui entre en scène par clip-path (du bas vers le haut) au scroll.
 *
 * NOTE assets : les macros matières dédiées (/public/textures) sont en attente
 * (lin, chêne, pierre, ardoise, laiton). En interim on utilise des plans larges de
 * réalisations réelles — l'effet « gros plan matière » d'Anai reste tenu.
 */
export function MaterialTransition({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return withMotion((gsap) => {
      gsap.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "power2.inOut",
          scrollTrigger: { trigger: el, start: "top 90%", end: "top 20%", scrub: 1 },
        },
      );
    });
  }, []);

  return (
    <div
      ref={ref}
      className="relative h-[50vh] w-full overflow-hidden md:h-[70vh]"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
    </div>
  );
}
