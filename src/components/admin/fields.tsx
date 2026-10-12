"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveContentAction } from "@/app/admin/actions";
import type { ContentKind } from "@/lib/content";

/** Champ texte / zone de texte avec libellé et aide. */
export function Field({
  label,
  hint,
  value,
  onChange,
  multiline,
  rows = 4,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="admin-label">
        {label}
        {required && <span className="text-terre"> *</span>}
      </span>
      {multiline ? (
        <textarea className="admin-input" rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="admin-input" type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <span className="mt-1 block text-xs text-lin">{hint}</span>}
    </label>
  );
}

/** Liste de textes (paragraphes, livrables…) : ajouter, modifier, retirer, réordonner. */
export function ListField({
  label,
  hint,
  value,
  onChange,
  addLabel,
  multiline = true,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (v: string[]) => void;
  addLabel: string;
  multiline?: boolean;
}) {
  const set = (i: number, v: string) => onChange(value.map((x, k) => (k === i ? v : x)));
  const move = (i: number, j: number) => {
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      <span className="admin-label">{label}</span>
      {hint && <span className="-mt-1 mb-2 block text-xs text-lin">{hint}</span>}
      <div className="space-y-2">
        {value.map((v, i) => (
          <div key={i} className="flex gap-2">
            {multiline ? (
              <textarea className="admin-input flex-1" rows={3} value={v} onChange={(e) => set(i, e.target.value)} />
            ) : (
              <input className="admin-input flex-1" value={v} onChange={(e) => set(i, e.target.value)} />
            )}
            <span className="flex flex-col">
              <button type="button" className="admin-icon-btn" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Monter">
                ▲
              </button>
              <button type="button" className="admin-icon-btn" onClick={() => move(i, i + 1)} disabled={i === value.length - 1} aria-label="Descendre">
                ▼
              </button>
              <button type="button" className="admin-icon-btn text-lin hover:text-red-700" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Retirer">
                ✕
              </button>
            </span>
          </div>
        ))}
      </div>
      <button type="button" className="admin-chip mt-2" onClick={() => onChange([...value, ""])}>
        + {addLabel}
      </button>
    </div>
  );
}

/** Barre d'enregistrement commune : publier/masquer + enregistrer, retour à la liste. */
export function useSave(kind: ContentKind, previousId: string | undefined, backHref: string) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const save = (published: boolean, data: Record<string, unknown>) =>
    start(async () => {
      setError(null);
      const res = await saveContentAction(kind, { previousId, published, data });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push(backHref);
      router.refresh();
    });

  return { save, pending, error };
}

export function SaveBar({
  published,
  setPublished,
  onSave,
  pending,
  error,
  backHref,
}: {
  published: boolean;
  setPublished: (v: boolean) => void;
  onSave: () => void;
  pending: boolean;
  error: string | null;
  backHref: string;
}) {
  return (
    <div className="admin-savebar">
      {error && <p className="admin-alert mb-3">{error}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-[var(--terre)]" />
          Visible sur le site
        </label>
        <span className="ml-auto flex gap-3">
          <a href={backHref} className="admin-chip">
            Annuler
          </a>
          <button type="button" onClick={onSave} disabled={pending} className="admin-btn">
            {pending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </span>
      </div>
    </div>
  );
}
