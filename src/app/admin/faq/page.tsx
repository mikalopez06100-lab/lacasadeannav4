import { requireAdmin } from "@/lib/auth";
import { listEntries, type FaqItem } from "@/lib/content";
import { EntryList } from "@/components/admin/EntryList";

export const dynamic = "force-dynamic";

export default async function FaqAdminPage() {
  await requireAdmin();
  const { entries } = await listEntries<FaqItem>("faq");
  return (
    <div>
      <h1 className="admin-h1">FAQ</h1>
      <EntryList
        kind="faq"
        basePath="/admin/faq"
        newLabel="Nouvelle question"
        sortable={true}
        items={entries.map((e) => ({ id: e.id, title: e.data.question, subtitle: e.data.answer.slice(0, 110), published: e.published }))}
      />
    </div>
  );
}
