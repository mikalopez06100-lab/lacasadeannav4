"use client";

import { useState } from "react";
import type { Img, Project } from "@/lib/content";
import { Field, ListField, SaveBar, useSave } from "./fields";
import { ImagesField } from "./ImagesField";

const BACK = "/admin/chantiers";

export function ProjectEditor({ initial, published: initialPublished }: { initial: Project | null; published: boolean }) {
  const [p, setP] = useState<Project>(
    initial ?? {
      slug: "",
      title: "",
      location: "",
      area: "Haute-Savoie",
      year: new Date().getFullYear(),
      type: "Résidentiel",
      excerpt: "",
      body: [""],
      materials: [],
      images: [],
    },
  );
  const [published, setPublished] = useState(initialPublished);
  const { save, pending, error } = useSave("project", initial?.slug, BACK);
  const set = <K extends keyof Project>(k: K, v: Project[K]) => setP((x) => ({ ...x, [k]: v }));

  return (
    <div className="space-y-8 pb-32">
      <section className="admin-panel space-y-5">
        <h2 className="admin-h2">Photos</h2>
        <p className="-mt-3 text-sm text-lin">
          La première photo est la couverture (carrousel de l&apos;accueil et page Réalisations). Les autres forment la galerie du chantier.
        </p>
        <ImagesField value={p.images} onChange={(v: Img[]) => set("images", v)} folder={`chantiers/${p.slug || "nouveau"}`} />
      </section>

      <section className="admin-panel grid gap-5 md:grid-cols-2">
        <h2 className="admin-h2 md:col-span-2">Informations</h2>
        <Field label="Titre" required value={p.title} onChange={(v) => set("title", v)} placeholder="Chalet vue lac" />
        <Field label="Lieu" value={p.location} onChange={(v) => set("location", v)} placeholder="Veyrier-du-Lac" />
        <Field label="Année" type="number" value={String(p.year)} onChange={(v) => set("year", Number(v))} />
        <label className="block">
          <span className="admin-label">Type de projet</span>
          <select className="admin-input" value={p.type} onChange={(e) => set("type", e.target.value as Project["type"])}>
            <option>Résidentiel</option>
            <option>Professionnel</option>
            <option>Mobilier sur mesure</option>
          </select>
        </label>
        <label className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[var(--terre)]"
            checked={p.status === "en-cours"}
            onChange={(e) => set("status", e.target.checked ? "en-cours" : undefined)}
          />
          <span>
            Chantier <strong>en cours</strong> <span className="text-sm text-lin">(affiche le badge « En cours » sur la photo)</span>
          </span>
        </label>
      </section>

      <section className="admin-panel space-y-5">
        <h2 className="admin-h2">Textes</h2>
        <Field
          label="Résumé"
          hint="Une ou deux phrases : affiché sous le titre et utilisé par Google."
          multiline
          rows={2}
          value={p.excerpt}
          onChange={(v) => set("excerpt", v)}
        />
        <ListField label="Description du chantier" hint="Un bloc par paragraphe." value={p.body} onChange={(v) => set("body", v)} addLabel="Ajouter un paragraphe" />
      </section>

      <section className="admin-panel space-y-4">
        <h2 className="admin-h2">Matières utilisées</h2>
        {p.materials.map((m, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
            <input
              className="admin-input"
              placeholder="Matière (ex. Chêne massif)"
              value={m.name}
              onChange={(e) => set("materials", p.materials.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)))}
            />
            <input
              className="admin-input"
              placeholder="Précision (facultatif)"
              value={m.note ?? ""}
              onChange={(e) => set("materials", p.materials.map((x, k) => (k === i ? { ...x, note: e.target.value } : x)))}
            />
            <button type="button" className="admin-icon-btn text-lin hover:text-red-700" onClick={() => set("materials", p.materials.filter((_, k) => k !== i))} aria-label="Retirer">
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="admin-chip" onClick={() => set("materials", [...p.materials, { name: "" }])}>
          + Ajouter une matière
        </button>
      </section>

      <section className="admin-panel grid gap-5 md:grid-cols-2">
        <h2 className="admin-h2 md:col-span-2">Témoignage du client (facultatif)</h2>
        <Field
          label="Citation"
          multiline
          rows={3}
          value={p.testimonial?.quote ?? ""}
          onChange={(v) => set("testimonial", { quote: v, author: p.testimonial?.author ?? "" })}
        />
        <Field
          label="Auteur"
          value={p.testimonial?.author ?? ""}
          onChange={(v) => set("testimonial", { quote: p.testimonial?.quote ?? "", author: v })}
          placeholder="Famille V., Veyrier-du-Lac"
        />
      </section>

      <SaveBar
        published={published}
        setPublished={setPublished}
        onSave={() => save(published, { ...p, body: p.body.filter((b) => b.trim()) })}
        pending={pending}
        error={error}
        backHref={BACK}
      />
    </div>
  );
}
