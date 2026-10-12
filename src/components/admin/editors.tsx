"use client";

import { useState } from "react";
import type { Article, FaqItem, Service, Testimonial } from "@/lib/content";
import { Field, ListField, SaveBar, useSave } from "./fields";
import { ImageField } from "./ImagesField";

/* ---------------------------- Journal ---------------------------- */

const CATEGORIES = ["Conseils", "Matières", "Making-of", "Inspiration"];

export function ArticleEditor({ initial, published: p0 }: { initial: Article | null; published: boolean }) {
  const back = "/admin/journal";
  const [a, setA] = useState<Article>(
    initial ?? { slug: "", title: "", date: new Date().toISOString().slice(0, 10), category: "Conseils", excerpt: "", body: [""], image: null },
  );
  const [published, setPublished] = useState(p0);
  const { save, pending, error } = useSave("article", initial?.slug, back);
  const set = <K extends keyof Article>(k: K, v: Article[K]) => setA((x) => ({ ...x, [k]: v }));

  return (
    <div className="space-y-8 pb-32">
      <section className="admin-panel grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Titre" required value={a.title} onChange={(v) => set("title", v)} />
        </div>
        <Field label="Date de publication" type="date" value={a.date} onChange={(v) => set("date", v)} />
        <label className="block">
          <span className="admin-label">Catégorie</span>
          <select className="admin-input" value={a.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <div className="md:col-span-2">
          <Field label="Chapeau" hint="Résumé affiché dans la liste des articles et sur Google." multiline rows={2} value={a.excerpt} onChange={(v) => set("excerpt", v)} />
        </div>
      </section>
      <section className="admin-panel space-y-3">
        <h2 className="admin-h2">Image de couverture</h2>
        <ImageField value={a.image} onChange={(v) => set("image", v)} folder="journal" />
      </section>
      <section className="admin-panel">
        <ListField label="Texte de l'article" hint="Un bloc par paragraphe." value={a.body} onChange={(v) => set("body", v)} addLabel="Ajouter un paragraphe" />
      </section>
      <SaveBar
        published={published}
        setPublished={setPublished}
        onSave={() => save(published, { ...a, body: a.body.filter((b) => b.trim()) })}
        pending={pending}
        error={error}
        backHref={back}
      />
    </div>
  );
}

/* ------------------------------ FAQ ------------------------------ */

export function FaqEditor({ initial, published: p0 }: { initial: FaqItem | null; published: boolean }) {
  const back = "/admin/faq";
  const [f, setF] = useState<FaqItem>(initial ?? { id: "", question: "", answer: "" });
  const [published, setPublished] = useState(p0);
  const { save, pending, error } = useSave("faq", initial?.id, back);
  return (
    <div className="space-y-8 pb-32">
      <section className="admin-panel space-y-5">
        <Field label="Question" required value={f.question} onChange={(v) => setF({ ...f, question: v })} />
        <Field label="Réponse" required multiline rows={6} value={f.answer} onChange={(v) => setF({ ...f, answer: v })} />
      </section>
      <SaveBar published={published} setPublished={setPublished} onSave={() => save(published, { ...f })} pending={pending} error={error} backHref={back} />
    </div>
  );
}

/* --------------------------- Avis clients --------------------------- */

export function TestimonialEditor({ initial, published: p0 }: { initial: Testimonial | null; published: boolean }) {
  const back = "/admin/avis";
  const [t, setT] = useState<Testimonial>(initial ?? { id: "", quote: "", author: "", project: "" });
  const [published, setPublished] = useState(p0);
  const { save, pending, error } = useSave("testimonial", initial?.id, back);
  return (
    <div className="space-y-8 pb-32">
      <section className="admin-panel grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Citation" required multiline rows={4} value={t.quote} onChange={(v) => setT({ ...t, quote: v })} />
        </div>
        <Field label="Auteur" required value={t.author} onChange={(v) => setT({ ...t, author: v })} placeholder="Famille V." />
        <Field label="Projet" value={t.project} onChange={(v) => setT({ ...t, project: v })} placeholder="Chalet vue lac · Veyrier-du-Lac" />
      </section>
      <SaveBar published={published} setPublished={setPublished} onSave={() => save(published, { ...t })} pending={pending} error={error} backHref={back} />
    </div>
  );
}

/* ---------------------------- Prestations ---------------------------- */

export function ServiceEditor({ initial, published: p0 }: { initial: Service; published: boolean }) {
  const back = "/admin/prestations";
  const [s, setS] = useState<Service>(initial);
  const [published, setPublished] = useState(p0);
  const { save, pending, error } = useSave("service", initial.id, back);
  const set = <K extends keyof Service>(k: K, v: Service[K]) => setS((x) => ({ ...x, [k]: v }));
  return (
    <div className="space-y-8 pb-32">
      <section className="admin-panel grid gap-5 md:grid-cols-2">
        <Field label="Nom" required value={s.name} onChange={(v) => set("name", v)} />
        <Field label="Numéro" value={s.index} onChange={(v) => set("index", v)} placeholder="01" />
        <Field label="Prix" hint="Laisser vide pour afficher « Sur devis »." value={s.price ?? ""} onChange={(v) => set("price", v || null)} placeholder="790 €" />
        <Field label="Durée" value={s.duration ?? ""} onChange={(v) => set("duration", v || undefined)} placeholder="3 heures" />
        <div className="md:col-span-2">
          <Field label="Description" multiline rows={4} value={s.description} onChange={(v) => set("description", v)} />
        </div>
      </section>
      <section className="admin-panel">
        <ListField label="Ce qui est inclus" value={s.deliverables} onChange={(v) => set("deliverables", v)} addLabel="Ajouter une ligne" multiline={false} />
      </section>
      <section className="admin-panel space-y-3">
        <h2 className="admin-h2">Visuel</h2>
        <ImageField value={s.image} onChange={(v) => set("image", v)} folder="prestations" />
      </section>
      <section className="admin-panel grid gap-5 md:grid-cols-2">
        <Field label="Texte du bouton" value={s.cta.label} onChange={(v) => set("cta", { ...s.cta, label: v })} />
        <Field label="Lien du bouton" value={s.cta.href} onChange={(v) => set("cta", { ...s.cta, href: v })} placeholder="/contact" />
      </section>
      <SaveBar
        published={published}
        setPublished={setPublished}
        onSave={() => save(published, { ...s, deliverables: s.deliverables.filter((d) => d.trim()) })}
        pending={pending}
        error={error}
        backHref={back}
      />
    </div>
  );
}
