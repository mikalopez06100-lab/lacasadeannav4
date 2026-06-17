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
 * Grille réalisations + filtre (brief §8).
 * Filtre par type ; transition douce au reflow (opacity, sans dépendance Flip).
 */
export function ProjectsGrid({ items }: { items: GridItem[] }) {
  const [type, setType] = useState("Tous");

  const filtered = useMemo(
    () => (type === "Tous" ? items : items.filter((p) => p.type === type)),
    [items, type],
  );

  return (
    <div className="container-x pb-32">
      <div className="mb-12 flex flex-wrap gap-x-6 gap-y-3 border-b border-ink/10 pb-6">
        {TYPES.map((t) => (
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

      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Link key={p.slug} href={`/realisations/${p.slug}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden bg-sand">
              {p.cover && (
                <Image
                  src={p.cover.src}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
                />
              )}
            </div>
            <h2 className="mt-4 font-fraunces text-xl">{p.title}</h2>
            <p className="mt-1 text-sm text-lin">
              {p.type} · {p.location} · {p.year}
            </p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-lin">Aucune réalisation dans cette catégorie pour le moment.</p>
      )}
    </div>
  );
}
