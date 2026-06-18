"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { withMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Image qui « arrive » au scroll : révélation par clip-path (haut→bas) + léger
 * dézoom. One-shot à l'entrée dans le viewport. Réutilisé prestations / journal.
 * Garde reduced-motion : si mouvement réduit, l'image reste simplement visible.
 */
export function RevealImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const img = el.querySelector("img");
    return withMotion((gsap) => {
      gsap.fromTo(
        el,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        },
      );
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.18 },
          {
            scale: 1,
            duration: 1.3,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          },
        );
      }
    });
  }, []);

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-sand", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
