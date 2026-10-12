import { requireAdmin } from "@/lib/auth";
import { listEntries, type Article } from "@/lib/content";
import { EntryList } from "@/components/admin/EntryList";

export const dynamic = "force-dynamic";

export default async function JournalAdminPage() {
  await requireAdmin();
  const { entries } = await listEntries<Article>("article");
  return (
    <div>
      <h1 className="admin-h1">Journal</h1>
      <EntryList
        kind="article"
        basePath="/admin/journal"
        newLabel="Nouvel article"
        sortable={false}
        items={entries.map((e) => ({ id: e.id, title: e.data.title, subtitle: `${e.data.category} · ${e.data.date}`, published: e.published, thumb: e.data.image }))}
      />
    </div>
  );
}
