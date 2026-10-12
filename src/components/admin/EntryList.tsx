"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteContentAction, reorderAction, setPublishedAction } from "@/app/admin/actions";
import type { ContentKind, Img } from "@/lib/content";

export type ListItem = { id: string; title: string; subtitle?: string; published: boolean; thumb?: Img | null; badge?: string };

/**
 * Liste admin : ordre (flèches), visible/masqué, modifier, supprimer.
 * L'ordre ici = l'ordre d'affichage sur le site.
 */
export function EntryList({
  kind,
  items: initial,
  basePath,
  newLabel,
  sortable = true,
  allowNew = true,
}: {
  kind: ContentKind;
  items: ListItem[];
  basePath: string;
  newLabel: string;
  sortable?: boolean;
  allowNew?: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<void>) =>
    start(async () => {
      setError(null);
      try {
        await fn();
        router.refresh();
      } catch {
        setError("L'opération a échoué. Vérifiez votre connexion et réessayez.");
      }
    });

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    run(() => reorderAction(kind, next.map((x) => x.id)));
  };

  const toggle = (item: ListItem) => {
    setItems((list) => list.map((x) => (x.id === item.id ? { ...x, published: !x.published } : x)));
    run(() => setPublishedAction(kind, item.id, !item.published));
  };

  const remove = (item: ListItem) => {
    if (!confirm(`Supprimer définitivement « ${item.title} » ?`)) return;
    setItems((list) => list.filter((x) => x.id !== item.id));
    run(() => deleteContentAction(kind, item.id));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-lin">
          {items.length} élément{items.length > 1 ? "s" : ""}
          {sortable && " · l'ordre ci-dessous est celui du site"}
          {pending && " · enregistrement…"}
        </p>
        {allowNew && (
          <Link href={`${basePath}/nouveau`} className="admin-btn">
            + {newLabel}
          </Link>
        )}
      </div>
      {error && <p className="admin-alert mt-4">{error}</p>}

      <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10 bg-white">
        {items.map((item, i) => (
          <li key={item.id} className={`flex items-center gap-3 px-3 py-3 md:gap-4 md:px-4 ${item.published ? "" : "opacity-55"}`}>
            {sortable && (
              <span className="flex flex-col">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0 || pending} className="admin-icon-btn" aria-label="Monter">
                  ▲
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1 || pending} className="admin-icon-btn" aria-label="Descendre">
                  ▼
                </button>
              </span>
            )}
            {item.thumb !== undefined && (
              <span className="relative h-14 w-14 flex-shrink-0 overflow-hidden bg-sand">
                {item.thumb && <Image src={item.thumb.src} alt="" fill sizes="56px" className="object-cover" />}
              </span>
            )}
            <Link href={`${basePath}/${encodeURIComponent(item.id)}`} className="min-w-0 flex-1">
              <span className="block truncate font-semibold hover:text-terre">
                {item.title}
                {item.badge && <span className="admin-badge ml-2">{item.badge}</span>}
              </span>
              {item.subtitle && <span className="block truncate text-sm text-lin">{item.subtitle}</span>}
            </Link>
            <button type="button" onClick={() => toggle(item)} disabled={pending} className="admin-chip" title="Afficher ou masquer sur le site">
              {item.published ? "Visible" : "Masqué"}
            </button>
            <Link href={`${basePath}/${encodeURIComponent(item.id)}`} className="admin-chip hidden sm:inline-block">
              Modifier
            </Link>
            <button type="button" onClick={() => remove(item)} disabled={pending} className="admin-icon-btn text-lin hover:text-red-700" aria-label={`Supprimer ${item.title}`}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
