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
 * Rail projets phares — scroll horizontal (brief §4.4, inspiré Anai).
 * - Mobile / tactile : scroll natif au doigt sur le viewport (overflow-x-auto).
 * - Desktop : GSAP Draggable sur la piste, bornes calculées sur (largeur piste − viewport).
 * Le bug précédent venait de bornes calculées sur la piste elle-même (w-max → plage nulle).
 */
export function ProjectRail({ items }: { items: RailItem[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return; // tactile → scroll natif du viewport

    const getBounds = () => ({
      minX: -Math.max(0, track.scrollWidth - viewport.clientWidth),
      maxX: 0,
    });

    const [drag] = Draggable.create(track, {
      type: "x",
      bounds: getBounds(),
      edgeResistance: 0.85,
      dragResistance: 0,
      cursor: "none",
      allowContextMenu: true,
    });

    const onResize = () => drag.applyBounds(getBounds());
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      drag.kill();
    };
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
        ref={viewportRef}
        data-cursor="drag"
        className="no-scrollbar overflow-x-auto md:overflow-hidden"
      >
        <div
          ref={trackRef}
          className="container-x flex w-max cursor-none select-none gap-6"
        >
          {items.map((project, i) => (
            <article key={project.slug} className="w-[78vw] flex-shrink-0 md:w-[42vw]">
              <span className="label mb-3 block text-lin">
                {counter(i, items.length)}
              </span>

              <Link
                href={`/realisations/${project.slug}`}
                className="group block"
                draggable={false}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                  {project.cover && (
                    <Image
                      src={project.cover.src}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 78vw, 42vw"
                      draggable={false}
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
      </div>
    </section>
  );
}
