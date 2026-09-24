"use client";

import Image from "next/image";
import { useState } from "react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { press } from "@/content/press";

const pages = Array.from({ length: 9 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/assets/img/presse/presse-${n}.webp`,
    alt: `Art & Décoration — page ${i + 1}`,
  };
});

/** Presse Art & Décoration — citation + feuilletage des pages (debrief client). */
export function Press() {
  const [index, setIndex] = useState(0);
  const current = pages[index];

  const go = (dir: number) =>
    setIndex((i) => (i + dir + pages.length) % pages.length);

  return (
    <section className="container-x py-24 md:py-32">
      <ScrollReveal className="text-center">
        <p className="label text-lin">Presse · {press.outlet}</p>
        <blockquote
          className="mx-auto mt-8 max-w-4xl font-fraunces text-3xl italic leading-snug md:text-5xl"
          style={{ fontVariationSettings: "'WONK' 1" }}
        >
          «&nbsp;{press.quote}&nbsp;»
        </blockquote>
        <cite className="label mt-8 block not-italic text-lin">
          {press.outlet} — « {press.feature} »
        </cite>
      </ScrollReveal>

      <ScrollReveal className="mx-auto mt-16 max-w-3xl">
        <div className="relative aspect-[4/5] overflow-hidden bg-sand">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            sizes="(max-width:768px) 100vw, 720px"
            className="object-contain"
          />
        </div>
        <div className="mt-6 flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => go(-1)}
            className="label text-ink/70 transition-colors hover:text-terre"
            aria-label="Page précédente"
          >
            ← Préc.
          </button>
          <span className="label text-lin">
            {String(index + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            className="label text-ink/70 transition-colors hover:text-terre"
            aria-label="Page suivante"
          >
            Suiv. →
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
}
