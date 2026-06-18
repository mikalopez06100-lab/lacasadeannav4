"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { nav, site } from "@/content/site";
import { registerGsap, gsap } from "@/lib/gsap";

/**
 * Menu overlay plein écran fond encre (brief §4.8).
 * Liens en stagger depuis le bas, Fraunces italic, hover terre brûlée.
 */
export function MenuOverlay({
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

    if (open) {
      el.style.pointerEvents = "auto";
      gsap.set(el, { autoAlpha: 1 });
      if (!reduce) {
        gsap.fromTo(
          el.querySelectorAll(".menu-link"),
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.07 },
        );
      }
    } else {
      gsap.to(el, { autoAlpha: 0, duration: 0.3, onComplete: () => (el.style.pointerEvents = "none") });
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={ref}
      data-cursor-dark
      className="invisible fixed inset-0 z-[90] flex flex-col justify-center bg-ink opacity-0"
      style={{ pointerEvents: "none" }}
      aria-hidden={!open}
    >
      <button
        type="button"
        onClick={onClose}
        className="label absolute left-5 top-5 text-cream md:left-16 md:top-6"
      >
        Fermer ×
      </button>

      <nav className="container-x flex flex-col gap-2 md:gap-3">
        {nav.map((item) => (
          <span key={item.href} className="line-mask">
            <Link
              href={item.href}
              onClick={onClose}
              className="menu-link block font-fraunces text-5xl italic text-cream transition-colors duration-200 hover:text-terre md:text-7xl"
              style={{ fontVariationSettings: "'WONK' 1" }}
            >
              {item.label}
            </Link>
          </span>
        ))}
      </nav>

      <div className="container-x mt-16">
        <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="label text-lin transition-colors hover:text-cream">
          Instagram {site.social.instagramHandle}
        </a>
      </div>
    </div>
  );
}
