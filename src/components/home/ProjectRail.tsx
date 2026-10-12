"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type RailItem = {
  slug: string;
  title: string;
  location: string;
  year: number;
  type: string;
  cover: { src: string; width: number; height: number } | null;
};

/**
 * « Nos réalisations » — carrousel de cartes compactes (retour client v3, calqué
 * sur le bloc « Dernières réalisations » de dreamdesignbuild.fr) :
 * cartes 340×425, flèches précédent/suivant, lien « Voir tout ».
 * Défilement natif (doigt, trackpad, molette shift) + accroche magnétique.
 */
export function ProjectRail({ items }: { items: RailItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scrollByCard = (dir: number) => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>("[data-rail-card]");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label text-terre">Portfolio</p>
            <h2 className="display-h2 mt-3">Nos réalisations</h2>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/realisations"
              className="label inline-flex items-center gap-2 text-terre transition-colors hover:text-ink"
            >
              Voir tout <span aria-hidden="true">→</span>
            </Link>
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={atStart}
                aria-label="Réalisations précédentes"
                className="rail-arrow"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={atEnd}
                aria-label="Réalisations suivantes"
                className="rail-arrow"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div
          ref={trackRef}
          onScroll={update}
          data-lenis-prevent-wheel
          className="rail-track flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
        >
          {items.map((project, i) => (
            <Link
              key={project.slug}
              href={`/realisations/${project.slug}`}
              data-rail-card
              className="group relative block aspect-[4/5] w-[78vw] max-w-[340px] flex-shrink-0 snap-start overflow-hidden bg-sand sm:w-[340px]"
            >
              {project.cover && (
                <Image
                  src={project.cover.src}
                  alt={`${project.title} — ${project.location}`}
                  fill
                  sizes="(max-width: 640px) 78vw, 340px"
                  className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent px-5 pb-5 pt-16">
                <span className="label text-terre">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 font-display text-lg font-semibold leading-tight tracking-tight">
                  {project.title}
                </h3>
                <p className="mt-0.5 text-sm text-lin">{project.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
