"use client";

import { useEffect, useRef, createElement } from "react";
import { withMotion, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "div";

/**
 * Révélation ligne par ligne en slide-up avec stagger (brief §4.2, inspiré Studio X).
 * On passe les lignes pré-découpées (ReactNode[]) — pas de mesure DOM, SSR-safe,
 * et chaque ligne peut contenir un mot en `accent-italic`.
 */
export function TextReveal({
  as = "h2",
  lines,
  className,
  delay = 0,
  start = "top 85%",
}: {
  as?: Tag;
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return withMotion((gsap) => {
      const targets = el.querySelectorAll(".line");
      gsap.fromTo(
        targets,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          delay,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
          },
        },
      );
    });
  }, [delay, start]);

  return createElement(
    as,
    { ref, className: cn(className) },
    lines.map((line, i) => (
      <span key={i} className="line-mask">
        <span className="line">{line}</span>
      </span>
    )),
  );
}
