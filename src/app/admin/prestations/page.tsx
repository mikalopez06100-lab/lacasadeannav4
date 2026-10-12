import { requireAdmin } from "@/lib/auth";
import { listEntries, type Service } from "@/lib/content";
import { EntryList } from "@/components/admin/EntryList";

export const dynamic = "force-dynamic";

export default async function PrestationsAdminPage() {
  await requireAdmin();
  const { entries } = await listEntries<Service>("service");
  return (
    <div>
      <h1 className="admin-h1">Prestations</h1>
      <EntryList
        kind="service"
        basePath="/admin/prestations"
        newLabel=""
        sortable={true}
        allowNew={false}
        items={entries.map((e) => ({ id: e.id, title: `${e.data.index} — ${e.data.name}`, subtitle: e.data.price ?? "Sur devis", published: e.published, thumb: e.data.image }))}
      />
    </div>
  );
}
