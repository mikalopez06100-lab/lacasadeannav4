"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type GridItem = {
  slug: string;
  title: string;
  location: string;
  area: string;
  year: number;
  type: string;
  cover: { src: string; width: number; height: number } | null;
};

const TYPES = ["Tous", "Résidentiel", "Professionnel", "Mobilier sur mesure"];

/**
 * Grille réalisations (brief client v2, inspirée de la home de nathalierives.com) :
 * mosaïque en colonnes qui respecte le format de chaque photo ; au survol, un voile
 * crème révèle le titre et le lieu. Sur tactile (pas de survol), légende sous l'image.
 * Toute la carte mène à la fiche projet (photos + descriptif).
 */
export function ProjectsGrid({ items }: { items: GridItem[] }) {
  const [type, setType] = useState("Tous");

  const types = TYPES.filter((t) => t === "Tous" || items.some((p) => p.type === t));
  const filtered = useMemo(
    () => (type === "Tous" ? items : items.filter((p) => p.type === type)),
    [items, type],
  );

  return (
    <div className="container-x pb-32">
      {types.length > 2 && (
        <div className="mb-10 flex flex-wrap gap-x-6 gap-y-3 border-b border-ink/10 pb-6">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "label transition-colors",
                type === t ? "text-terre" : "text-lin hover:text-ink",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            href={`/realisations/${p.slug}`}
            className="project-tile group mb-5 block break-inside-avoid"
          >
            <div className="relative overflow-hidden bg-sand">
              {p.cover && (
                <Image
                  src={p.cover.src}
                  alt={`${p.title} — ${p.location}`}
                  width={p.cover.width}
                  height={p.cover.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-auto w-full transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
                />
              )}
              <div className="project-tile-over" aria-hidden="true">
                <span className="font-display text-xl font-semibold uppercase tracking-[0.06em] md:text-2xl">
                  {p.title}
                </span>
                <span className="label mt-2 text-terre">{p.location}</span>
              </div>
            </div>
            <div className="project-tile-cap mt-3">
              <h2 className="font-display text-lg font-semibold tracking-tight">{p.title}</h2>
              <p className="mt-0.5 text-sm text-lin">
                {p.location} · {p.year}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-lin">Aucune réalisation dans cette catégorie pour le moment.</p>
      )}
    </div>
  );
}
