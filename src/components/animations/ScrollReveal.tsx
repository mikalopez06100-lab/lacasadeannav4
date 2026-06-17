"use client";

import { useEffect, useRef } from "react";
import { withMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Fade + légère translation verticale au scroll (brief §4.7).
 * Garde reduced-motion héritée de withMotion : si le mouvement est réduit,
 * le contenu reste simplement visible (pas d'opacité 0 piégée).
 */
export function ScrollReveal({
  children,
  className,
  as: Tag = "div",
  y = 40,
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  y?: number;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return withMotion((gsap) => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        },
      );
    });
  }, [y, delay]);

  // @ts-expect-error — Tag dynamique
  return <Tag ref={ref} id={id} className={cn(className)}>{children}</Tag>;
}
