import { requireAdmin } from "@/lib/auth";
import { listEntries, type Testimonial } from "@/lib/content";
import { EntryList } from "@/components/admin/EntryList";

export const dynamic = "force-dynamic";

export default async function AvisAdminPage() {
  await requireAdmin();
  const { entries } = await listEntries<Testimonial>("testimonial");
  return (
    <div>
      <h1 className="admin-h1">Avis clients</h1>
      <EntryList
        kind="testimonial"
        basePath="/admin/avis"
        newLabel="Nouvel avis"
        sortable={true}
        items={entries.map((e) => ({ id: e.id, title: e.data.author, subtitle: e.data.quote.slice(0, 110), published: e.published }))}
      />
    </div>
  );
}
