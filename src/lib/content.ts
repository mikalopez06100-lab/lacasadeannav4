import "server-only";
import { unstable_cache } from "next/cache";
import { getSql } from "@/lib/db";
import { imagesByCategory, resolveImage, variant } from "@/lib/images";
import { projects as staticProjects, type Material, type ProjectType } from "@/content/projects";
import { journal as staticJournal, articleImage, type Article as StaticArticle } from "@/content/journal";
import { faq as staticFaq } from "@/content/faq";
import { testimonials as staticTestimonials } from "@/content/testimonials";
import { services as staticServices, serviceImage, type Service as StaticService } from "@/content/services";

/**
 * Contenus éditables depuis /admin — source unique pour les pages du site.
 *
 * Lecture : base Neon (table content_items) si elle contient des éléments pour ce type,
 * sinon contenu statique de src/content (le site ne casse jamais, même sans base).
 * Le contenu statique n'est copié en base qu'au premier enregistrement depuis l'admin.
 * Cache Next par type, invalidé par revalidateTag(`content:<type>`) à chaque modification.
 */

export type Img = { src: string; width: number; height: number; alt?: string };

export type Project = {
  slug: string;
  title: string;
  location: string;
  area: string;
  year: number;
  type: ProjectType;
  status?: "en-cours";
  excerpt: string;
  body: string[];
  materials: Material[];
  testimonial?: { quote: string; author: string };
  featured?: boolean;
  images: Img[]; // la première est la couverture
};

export type Article = Omit<StaticArticle, "category"> & {
  category: string;
  image: Img | null;
};

export type FaqItem = { id: string; question: string; answer: string };

export type Testimonial = { id: string; quote: string; author: string; project: string };

export type Service = Omit<StaticService, "price"> & { price: string | null; image: Img | null };

export type ContentKind = "project" | "article" | "faq" | "testimonial" | "service";

/** Élément tel que stocké : données + métadonnées d'édition. */
export type Entry<T> = { id: string; published: boolean; data: T };

/* ------------------------------------------------------------------ */
/* Contenu statique (repli + amorçage de la base)                       */
/* ------------------------------------------------------------------ */

const toImg = (out: { path: string; width?: number; height?: number } | undefined): Img | null =>
  out ? { src: out.path, width: out.width ?? 1600, height: out.height ?? 1200 } : null;

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

async function staticEntries(kind: ContentKind): Promise<Entry<unknown>[]> {
  switch (kind) {
    case "project":
      return Promise.all(
        staticProjects.map(async (p) => {
          const all = await imagesByCategory(p.imageCategory);
          const coverIndex = p.coverIndex ?? 0;
          const skip = new Set([coverIndex, ...(p.excludeImages ?? [])]);
          const ordered = [all[coverIndex], ...all.filter((_, i) => !skip.has(i))];
          const images = ordered.map((img) => toImg(variant(img, "full"))).filter(Boolean) as Img[];
          const { imageCategory: _c, coverIndex: _i, excludeImages: _e, ...rest } = p;
          void _c, _i, _e;
          return { id: p.slug, published: true, data: { ...rest, images } satisfies Project };
        }),
      );
    case "article":
      return Promise.all(
        staticJournal.map(async (a) => {
          const ref = articleImage[a.slug];
          const image = ref ? await resolveImage(ref.category, { index: ref.index, variant: "full" }) : null;
          return { id: a.slug, published: true, data: { ...a, image } satisfies Article };
        }),
      );
    case "faq":
      return staticFaq.map((f) => {
        const id = slugify(f.question);
        return { id, published: true, data: { id, ...f } satisfies FaqItem };
      });
    case "testimonial":
      return staticTestimonials.map((t) => {
        const id = slugify(`${t.author}-${t.project}`);
        return { id, published: true, data: { id, ...t } satisfies Testimonial };
      });
    case "service":
      return Promise.all(
        staticServices.map(async (s) => {
          const ref = serviceImage[s.id];
          const image = ref ? await resolveImage(ref.category, { index: ref.index, variant: "full" }) : null;
          return { id: s.id, published: true, data: { ...s, image } satisfies Service };
        }),
      );
  }
}

/* ------------------------------------------------------------------ */
/* Lecture                                                              */
/* ------------------------------------------------------------------ */

/** Tous les éléments d'un type, brouillons compris (admin). `fromDb` = déjà copié en base. */
export async function listEntries<T>(kind: ContentKind): Promise<{ entries: Entry<T>[]; fromDb: boolean }> {
  try {
    const sql = await getSql();
    if (sql) {
      const rows = (await sql`
        select id, published, data from content_items
        where kind = ${kind} order by position asc, id asc`) as { id: string; published: boolean; data: T }[];
      if (rows.length > 0) return { entries: rows, fromDb: true };
    }
  } catch (err) {
    console.error(`[content] lecture ${kind} impossible, repli statique`, err);
  }
  return { entries: (await staticEntries(kind)) as Entry<T>[], fromDb: false };
}

function cachedPublished<T>(kind: ContentKind) {
  return unstable_cache(
    async () => (await listEntries<T>(kind)).entries.filter((e) => e.published).map((e) => e.data),
    // Clé liée au déploiement : un changement du contenu de repli (src/content) est pris en compte
    // dès la mise en ligne, sans attendre l'expiration du cache. Les modifs admin passent par revalidateTag.
    ["content", kind, process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "local"],
    { tags: [`content:${kind}`], revalidate: 3600 },
  );
}

export const getProjects = cachedPublished<Project>("project");
export const getArticles = cachedPublished<Article>("article");
export const getFaq = cachedPublished<FaqItem>("faq");
export const getTestimonials = cachedPublished<Testimonial>("testimonial");
export const getServices = cachedPublished<Service>("service");

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug);
}

export async function getArticle(slug: string) {
  return (await getArticles()).find((a) => a.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Écriture (appelée par les actions serveur de l'admin, déjà authentifiées) */
/* ------------------------------------------------------------------ */

/** Copie le contenu statique en base la première fois qu'un type est modifié. */
export async function materialize(kind: ContentKind) {
  const sql = await getSql();
  if (!sql) throw new Error("Base de données non configurée (DATABASE_URL manquante).");
  const [{ count }] = (await sql`select count(*)::int as count from content_items where kind = ${kind}`) as {
    count: number;
  }[];
  if (count > 0) return sql;
  const entries = await staticEntries(kind);
  for (const [position, e] of entries.entries()) {
    await sql`
      insert into content_items (kind, id, position, published, data, updated_by)
      values (${kind}, ${e.id}, ${position}, ${e.published}, ${JSON.stringify(e.data)}::jsonb, 'import')
      on conflict (kind, id) do nothing`;
  }
  return sql;
}

export async function saveEntry(
  kind: ContentKind,
  entry: { id: string; previousId?: string; published: boolean; data: unknown },
  by: string,
) {
  const sql = await materialize(kind);
  const prev = entry.previousId ?? entry.id;
  const existing = (await sql`select position from content_items where kind = ${kind} and id = ${prev}`) as {
    position: number;
  }[];
  let position: number;
  if (existing.length) {
    position = existing[0].position;
  } else {
    // Nouvel élément : en tête de liste (les nouveaux chantiers apparaissent en premier)
    await sql`update content_items set position = position + 1 where kind = ${kind}`;
    position = 0;
  }
  if (prev !== entry.id) await sql`delete from content_items where kind = ${kind} and id = ${prev}`;
  await sql`
    insert into content_items (kind, id, position, published, data, updated_at, updated_by)
    values (${kind}, ${entry.id}, ${position}, ${entry.published}, ${JSON.stringify(entry.data)}::jsonb, now(), ${by})
    on conflict (kind, id) do update set
      published = excluded.published, data = excluded.data,
      updated_at = now(), updated_by = excluded.updated_by`;
}

export async function deleteEntry(kind: ContentKind, id: string) {
  const sql = await materialize(kind);
  await sql`delete from content_items where kind = ${kind} and id = ${id}`;
}

export async function reorderEntries(kind: ContentKind, ids: string[]) {
  const sql = await materialize(kind);
  for (const [position, id] of ids.entries()) {
    await sql`update content_items set position = ${position} where kind = ${kind} and id = ${id}`;
  }
}

export async function setPublished(kind: ContentKind, id: string, published: boolean) {
  const sql = await materialize(kind);
  await sql`update content_items set published = ${published}, updated_at = now() where kind = ${kind} and id = ${id}`;
}
