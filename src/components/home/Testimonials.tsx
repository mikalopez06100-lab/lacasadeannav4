"use client";

import { useState } from "react";
import { testimonials } from "@/content/testimonials";

/**
 * Bloc témoignages (brief §7 section 10, inspiré Studio X).
 * Citation centrée en grand, navigation gauche/droite, pas de photos.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  const current = testimonials[index];

  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);

  return (
    <section className="bg-ink py-24 text-cream md:py-32">
      <div className="container-x text-center">
        <p className="label text-lin">Ils nous ont fait confiance</p>

        <blockquote
          key={index}
          className="mx-auto mt-10 max-w-4xl font-fraunces text-3xl italic leading-snug md:text-5xl"
          style={{ fontVariationSettings: "'WONK' 1" }}
        >
          «&nbsp;{current.quote}&nbsp;»
        </blockquote>

        <p className="mt-8">
          <span className="font-fraunces text-xl">{current.author}</span>
          <span className="label mt-2 block text-lin">{current.project}</span>
        </p>

        <div className="mt-12 flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Témoignage précédent"
            className="label text-cream/70 transition-colors hover:text-cream"
          >
            ← Préc.
          </button>
          <span className="label text-lin">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Témoignage suivant"
            className="label text-cream/70 transition-colors hover:text-cream"
          >
            Suiv. →
          </button>
        </div>
      </div>
    </section>
  );
}
