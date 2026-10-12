"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { logout, requestLoginLink, requireAdmin } from "@/lib/auth";
import {
  deleteEntry,
  reorderEntries,
  saveEntry,
  setPublished,
  slugify,
  type ContentKind,
  type Img,
} from "@/lib/content";

/* ------------------------------------------------------------------ */
/* Connexion                                                            */
/* ------------------------------------------------------------------ */

export type LoginState = { status: "idle" | "sent" | "error"; message?: string; devLink?: string };

export async function requestLoginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
    return { status: "error", message: "Adresse e-mail invalide." };
  }
  const h = headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const res = await requestLoginLink(email, origin);
  if (!res.ok) return { status: "error", message: res.error };
  return { status: "sent", devLink: res.devLink };
}

export async function logoutAction() {
  logout();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ */
/* Contenus                                                             */
/* ------------------------------------------------------------------ */

export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

function refresh(kind: ContentKind) {
  revalidateTag(`content:${kind}`);
  revalidatePath("/", "layout"); // pages déjà générées (accueil, réalisations, journal…)
}

const str = (v: unknown, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const strList = (v: unknown) =>
  Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean) : [];
const img = (v: unknown): Img | null => {
  const o = v as Partial<Img> | null;
  if (!o || typeof o.src !== "string" || !o.src) return null;
  if (!o.src.startsWith("/assets/") && !/^https:\/\/[a-z0-9.-]+\.public\.blob\.vercel-storage\.com\//.test(o.src)) {
    return null; // uniquement nos images locales ou le stockage Vercel Blob du projet
  }
  return { src: o.src, width: Number(o.width) || 1600, height: Number(o.height) || 1200, alt: str(o.alt, 200) || undefined };
};

/** Nettoie et valide les données reçues du formulaire, par type de contenu. */
function sanitize(kind: ContentKind, raw: Record<string, unknown>): { id: string; data: unknown } | string {
  switch (kind) {
    case "project": {
      const title = str(raw.title, 120);
      if (!title) return "Le titre est obligatoire.";
      const slug = slugify(str(raw.slug) || title);
      const images = (Array.isArray(raw.images) ? raw.images : []).map(img).filter(Boolean) as Img[];
      if (images.length === 0) return "Ajoutez au moins une photo (la première sert de couverture).";
      const types = ["Résidentiel", "Professionnel", "Mobilier sur mesure"];
      const t = raw.testimonial as { quote?: unknown; author?: unknown } | undefined;
      return {
        id: slug,
        data: {
          slug,
          title,
          location: str(raw.location, 120),
          area: str(raw.area, 60) || "Haute-Savoie",
          year: Math.min(2100, Math.max(1990, Number(raw.year) || new Date().getFullYear())),
          type: types.includes(str(raw.type)) ? str(raw.type) : "Résidentiel",
          status: raw.status === "en-cours" ? "en-cours" : undefined,
          excerpt: str(raw.excerpt, 400),
          body: strList(raw.body),
          materials: (Array.isArray(raw.materials) ? raw.materials : [])
            .map((m) => ({ name: str((m as { name?: unknown }).name, 80), note: str((m as { note?: unknown }).note, 120) || undefined }))
            .filter((m) => m.name),
          testimonial: t && str(t.quote) ? { quote: str(t.quote, 600), author: str(t.author, 120) } : undefined,
          featured: Boolean(raw.featured),
          images,
        },
      };
    }
    case "article": {
      const title = str(raw.title, 160);
      if (!title) return "Le titre est obligatoire.";
      const slug = slugify(str(raw.slug) || title);
      const date = /^\d{4}-\d{2}-\d{2}$/.test(str(raw.date)) ? str(raw.date) : new Date().toISOString().slice(0, 10);
      return {
        id: slug,
        data: {
          slug,
          title,
          date,
          category: str(raw.category, 40) || "Conseils",
          excerpt: str(raw.excerpt, 400),
          body: strList(raw.body),
          image: img(raw.image),
        },
      };
    }
    case "faq": {
      const question = str(raw.question, 300);
      const answer = str(raw.answer, 3000);
      if (!question || !answer) return "La question et la réponse sont obligatoires.";
      const id = str(raw.id) || slugify(question);
      return { id, data: { id, question, answer } };
    }
    case "testimonial": {
      const quote = str(raw.quote, 800);
      const author = str(raw.author, 120);
      if (!quote || !author) return "La citation et l'auteur sont obligatoires.";
      const id = str(raw.id) || slugify(`${author}-${Date.now()}`);
      return { id, data: { id, quote, author, project: str(raw.project, 160) } };
    }
    case "service": {
      const name = str(raw.name, 120);
      const id = str(raw.id);
      if (!name || !id) return "Le nom de la prestation est obligatoire.";
      const cta = raw.cta as { label?: unknown; href?: unknown } | undefined;
      return {
        id,
        data: {
          id,
          index: str(raw.index, 4),
          name,
          price: str(raw.price, 60) || null,
          duration: str(raw.duration, 60) || undefined,
          description: str(raw.description, 1500),
          deliverables: strList(raw.deliverables),
          cta: { label: str(cta?.label, 60) || "Demander un devis", href: str(cta?.href, 200) || "/contact" },
          highlight: Boolean(raw.highlight),
          image: img(raw.image),
        },
      };
    }
  }
}

export async function saveContentAction(
  kind: ContentKind,
  payload: { previousId?: string; published: boolean; data: Record<string, unknown> },
): Promise<SaveResult> {
  const by = await requireAdmin();
  const clean = sanitize(kind, payload.data);
  if (typeof clean === "string") return { ok: false, error: clean };
  try {
    await saveEntry(kind, { id: clean.id, previousId: payload.previousId, published: payload.published, data: clean.data }, by);
  } catch (err) {
    console.error("[admin] enregistrement", kind, err);
    return { ok: false, error: "Enregistrement impossible. Vérifiez la connexion à la base de données." };
  }
  refresh(kind);
  return { ok: true, id: clean.id };
}

export async function deleteContentAction(kind: ContentKind, id: string) {
  await requireAdmin();
  await deleteEntry(kind, id);
  refresh(kind);
}

export async function setPublishedAction(kind: ContentKind, id: string, published: boolean) {
  await requireAdmin();
  await setPublished(kind, id, published);
  refresh(kind);
}

export async function reorderAction(kind: ContentKind, ids: string[]) {
  await requireAdmin();
  await reorderEntries(kind, ids.map((i) => str(i, 120)));
  refresh(kind);
}
