import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { listEntries, type Project } from "@/lib/content";
import { ProjectEditor } from "@/components/admin/ProjectEditor";

export const dynamic = "force-dynamic";

export default async function EditChantier({ params }: { params: { id: string } }) {
  await requireAdmin();
  const id = decodeURIComponent(params.id);
  const isNew = id === "nouveau";
  const entry = isNew ? null : (await listEntries<Project>("project")).entries.find((e) => e.id === id);
  if (!isNew && !entry) notFound();

  return (
    <div>
      <Link href="/admin/chantiers" className="text-sm text-lin hover:text-ink">
        ← Chantiers
      </Link>
      <h1 className="admin-h1 mt-2">{isNew ? "Nouveau chantier" : entry!.data.title}</h1>
      {!isNew && (
        <Link href={`/realisations/${entry!.id}`} target="_blank" className="text-sm text-terre hover:underline">
          Voir la page sur le site ↗
        </Link>
      )}
      <div className="mt-6">
        <ProjectEditor initial={entry?.data ?? null} published={entry?.published ?? true} />
      </div>
    </div>
  );
}
