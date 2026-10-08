"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { press } from "@/content/press";

const pages = Array.from({ length: 9 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/assets/img/presse/presse-${n}.webp`,
    alt: `Art & Décoration — page ${i + 1}`,
  };
});

/**
 * Presse Art & Décoration (brief client v2) : présentation compacte —
 * couverture cliquable + citation ; le reportage se feuillette dans une visionneuse.
 */
export function Press() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const current = pages[index];

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + pages.length) % pages.length),
    [],
  );

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [open, close, go]);

  return (
    <section className="container-x py-20 md:py-28">
      <ScrollReveal className="mx-auto grid max-w-5xl items-center gap-10 sm:grid-cols-[auto_1fr] md:gap-16">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          className="group w-40 justify-self-center text-left sm:w-48 sm:justify-self-start md:w-56"
          aria-label={`Feuilleter le reportage ${press.outlet} — ${pages.length} pages`}
        >
          <span className="block overflow-hidden shadow-[0_22px_44px_rgba(12,10,8,0.16)] transition-transform duration-500 ease-soft group-hover:-translate-y-1.5 group-hover:-rotate-1">
            <Image
              src={pages[0].src}
              alt={`Couverture ${press.outlet} — « ${press.feature} »`}
              width={646}
              height={793}
              sizes="224px"
              className="h-auto w-full"
            />
          </span>
          <span className="label mt-4 block text-center text-terre sm:text-left">
            Feuilleter →
          </span>
        </button>

        <div className="text-center sm:text-left">
          <p className="label text-lin">Presse · {press.outlet}</p>
          <blockquote className="mt-5 font-display text-2xl font-light italic leading-snug md:text-3xl">
            «&nbsp;{press.quote}&nbsp;»
          </blockquote>
          <cite className="label mt-6 block not-italic text-lin">
            {press.outlet} — « {press.feature} » · {pages.length} pages
          </cite>
        </div>
      </ScrollReveal>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Reportage ${press.outlet}`}
          data-lenis-prevent
          data-cursor-dark
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink/95 px-4 py-16 text-cream"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="label absolute right-5 top-5 p-2 text-cream/80 transition-colors hover:text-cream"
          >
            Fermer ✕
          </button>

          <div className="relative h-full max-h-[78vh] w-full max-w-3xl">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              sizes="(max-width:768px) 100vw, 768px"
              className="object-contain"
            />
          </div>

          <div className="mt-6 flex items-center gap-8">
            <button
              type="button"
              onClick={() => go(-1)}
              className="label p-2 text-cream/80 transition-colors hover:text-cream"
              aria-label="Page précédente"
            >
              ← Préc.
            </button>
            <span className="label text-cream/60">
              {String(index + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              className="label p-2 text-cream/80 transition-colors hover:text-cream"
              aria-label="Page suivante"
            >
              Suiv. →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
