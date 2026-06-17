"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";

/**
 * Curseur personnalisé desktop (brief §3.4).
 * - défaut : cercle 10px, bordure ink
 * - survol cliquable : 40px, fond crème 80%
 * - zone de drag ([data-cursor="drag"]) : label « DRAG »
 * Masqué sur tactile via @media (hover) — on ne monte rien si pointeur grossier.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    registerGsap();
    const dot = dotRef.current!;
    document.body.classList.add("has-custom-cursor");

    // Lerp naturel via quickTo (facteur ~0.12)
    const xTo = gsap.quickTo(dot, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const setState = (state: "default" | "hover" | "drag") => {
      dot.dataset.state = state;
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        "a, button, [role='button'], [data-cursor]",
      ) as HTMLElement | null;
      if (!target) return setState("default");
      if (target.dataset.cursor === "drag") return setState("drag");
      setState("hover");
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
    <div ref={dotRef} aria-hidden="true" className="cursor-dot" data-state="default">
      <span ref={labelRef} className="cursor-label">
        Drag
      </span>
      <style jsx>{`
        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 10px;
          height: 10px;
          margin: -5px 0 0 -5px;
          border: 1px solid var(--ink);
          border-radius: 999px;
          background: transparent;
          pointer-events: none;
          z-index: 9999;
          display: grid;
          place-items: center;
          transition:
            width 0.25s cubic-bezier(0.16, 1, 0.3, 1),
            height 0.25s cubic-bezier(0.16, 1, 0.3, 1),
            background-color 0.25s ease,
            border-color 0.25s ease;
        }
        .cursor-label {
          font-family: var(--font-bricolage), sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--cream);
          opacity: 0;
          transition: opacity 0.2s ease;
          white-space: nowrap;
        }
        .cursor-dot[data-state="hover"] {
          width: 40px;
          height: 40px;
          margin: -20px 0 0 -20px;
          background: rgba(239, 235, 227, 0.8);
          border-color: transparent;
        }
        .cursor-dot[data-state="drag"] {
          width: 56px;
          height: 56px;
          margin: -28px 0 0 -28px;
          background: var(--ink);
          border-color: var(--ink);
        }
        .cursor-dot[data-state="drag"] .cursor-label {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
