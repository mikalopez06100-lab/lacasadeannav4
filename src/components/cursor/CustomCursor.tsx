"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";

/**
 * Curseur personnalisé = pictogramme « a » de la marque (desktop, pointeur fin).
 * - suit la souris avec un léger lerp
 * - s'agrandit au survol des éléments cliquables / zone de drag
 * - permute noir ↔ beige selon le fond : sections foncées marquées [data-cursor-dark]
 * Masqué sur tactile (@media hover:none → on ne monte rien).
 */
export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    registerGsap();
    const outer = outerRef.current!;
    const inner = innerRef.current!;
    document.body.classList.add("has-custom-cursor");

    const xTo = gsap.quickTo(outer, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(outer, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      const clickable = el?.closest("a, button, [role='button'], [data-cursor]");
      inner.dataset.state = clickable ? "active" : "default";
      inner.dataset.theme = el?.closest("[data-cursor-dark]") ? "dark" : "light";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div ref={outerRef} aria-hidden="true" className="cursor-root">
      <div ref={innerRef} className="cursor-inner" data-state="default" data-theme="light">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pic dark-pic" src="/assets/brand/pictogram-black.webp" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pic light-pic" src="/assets/brand/pictogram-beige.webp" alt="" />
      </div>
      <style jsx>{`
        .cursor-root {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9999;
        }
        .cursor-inner {
          position: relative;
          width: 30px;
          height: 30px;
          margin: -15px 0 0 -15px;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pic {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: opacity 0.2s ease;
        }
        .light-pic {
          opacity: 0;
        }
        .cursor-inner[data-theme="dark"] .dark-pic {
          opacity: 0;
        }
        .cursor-inner[data-theme="dark"] .light-pic {
          opacity: 1;
        }
        .cursor-inner[data-state="active"] {
          transform: scale(1.7);
        }
      `}</style>
    </div>
  );
}
