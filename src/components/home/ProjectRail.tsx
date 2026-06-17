"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { registerGsap, Draggable } from "@/lib/gsap";
import { counter } from "@/lib/utils";

export type RailItem = {
  slug: string;
  title: string;
  location: string;
  year: number;
  type: string;
  cover: { src: string; width: number; height: number } | null;
};

/**
 * Rail projets phares en scroll horizontal drag-to-scroll (brief §4.4, inspiré Anai).
 * Compteur numéroté, curseur custom « DRAG » sur la zone (data-cursor="drag").
 * Le drag est désactivé proprement si Draggable ne peut pas s'initialiser (SSR/no-JS) :
 * la liste reste scrollable horizontalement au doigt / trackpad.
 */
export function ProjectRail({ items }: { items: RailItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const track = trackRef.current;
    if (!track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return; // tactile → scroll natif

    const totalWidth = track.scrollWidth - track.clientWidth;
    const instances = Draggable.create(track, {
      type: "x",
      bounds: { minX: -totalWidth, maxX: 0 },
      edgeResistance: 0.9,
      cursor: "none",
    });

    return () => instances.forEach((i) => i.kill());
  }, [items]);

  return (
    <section className="overflow-hidden py-24 md:py-32">
      <div className="container-x mb-12 flex items-end justify-between">
        <h2
          className="font-fraunces text-5xl italic md:text-7xl"
          style={{ fontVariationSettings: "'WONK' 1" }}
        >
          Réalisations
        </h2>
        <span className="label text-lin">Glissez →</span>
      </div>

      <div
        ref={trackRef}
        data-cursor="drag"
        className="container-x flex w-max select-none gap-6 overflow-x-auto md:overflow-visible"
      >
        {items.map((project, i) => (
          <article key={project.slug} className="w-[78vw] flex-shrink-0 md:w-[42vw]">
            <span className="label mb-3 block text-lin">
              {counter(i, items.length)}
            </span>

            <Link href={`/realisations/${project.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                {project.cover && (
                  <Image
                    src={project.cover.src}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 78vw, 42vw"
                    className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
                  />
                )}
              </div>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-fraunces text-xl">{project.title}</h3>
                  <p className="mt-1 text-sm text-lin">
                    {project.location} · {project.year}
                  </p>
                </div>
                <span className="label whitespace-nowrap border-b border-ink pb-0.5 transition-colors group-hover:border-terre group-hover:text-terre">
                  Voir →
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
