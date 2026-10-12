import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
import { listEntries, type ContentKind } from "@/lib/content";

export const dynamic = "force-dynamic";

const SECTIONS: { kind: ContentKind; href: string; title: string; hint: string }[] = [
  { kind: "project", href: "/admin/chantiers", title: "Chantiers", hint: "Ajouter un chantier, ses photos, son texte, l'ordre d'affichage." },
  { kind: "article", href: "/admin/journal", title: "Journal", hint: "Écrire et publier des articles." },
  { kind: "faq", href: "/admin/faq", title: "FAQ", hint: "Questions fréquentes de l'accueil." },
  { kind: "testimonial", href: "/admin/avis", title: "Avis clients", hint: "Témoignages affichés sur l'accueil et la page Studio." },
  { kind: "service", href: "/admin/prestations", title: "Prestations", hint: "Textes, prix et contenus des formules." },
];

export default async function AdminHome() {
  const email = await requireAdmin();
  const counts = await Promise.all(SECTIONS.map(async (s) => (await listEntries(s.kind)).entries.length));
  const checks = [
    { ok: hasDatabase(), label: "Base de données (Neon)" },
    { ok: Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN), label: "Stockage des photos (Vercel Blob)" },
    { ok: Boolean(process.env.BREVO_API_KEY), label: "Envoi d'e-mails (Brevo)" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Bonjour 👋</h1>
      <p className="mt-1 text-lin">Connectée en tant que {email}. Chaque modification est en ligne en quelques secondes.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s, i) => (
          <Link key={s.href} href={s.href} className="admin-card group">
            <span className="flex items-baseline justify-between">
              <span className="font-display text-xl font-semibold group-hover:text-terre">{s.title}</span>
              <span className="text-sm text-lin">{counts[i]}</span>
            </span>
            <span className="mt-2 block text-sm text-lin">{s.hint}</span>
          </Link>
        ))}
      </div>

      {checks.some((c) => !c.ok) && (
        <div className="admin-alert mt-10">
          <p className="font-semibold">Configuration incomplète</p>
          <ul className="mt-2 space-y-1 text-sm">
            {checks.map((c) => (
              <li key={c.label}>
                {c.ok ? "✓" : "✕"} {c.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
