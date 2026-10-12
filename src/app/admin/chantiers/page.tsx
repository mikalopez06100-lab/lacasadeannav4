import { requireAdmin } from "@/lib/auth";
import { listEntries, type Project } from "@/lib/content";
import { EntryList } from "@/components/admin/EntryList";

export const dynamic = "force-dynamic";

export default async function ChantiersPage() {
  await requireAdmin();
  const { entries } = await listEntries<Project>("project");
  return (
    <div>
      <h1 className="admin-h1">Chantiers</h1>
      <EntryList
        kind="project"
        basePath="/admin/chantiers"
        newLabel="Nouveau chantier"
        items={entries.map((e) => ({
          id: e.id,
          title: e.data.title,
          subtitle: [e.data.location, e.data.year, `${e.data.images.length} photo${e.data.images.length > 1 ? "s" : ""}`].filter(Boolean).join(" · "),
          published: e.published,
          thumb: e.data.images[0] ?? null,
          badge: e.data.status === "en-cours" ? "En cours" : undefined,
        }))}
      />
    </div>
  );
}
