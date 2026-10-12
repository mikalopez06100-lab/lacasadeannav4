import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { listEntries, type Service } from "@/lib/content";
import { ServiceEditor } from "@/components/admin/editors";

export const dynamic = "force-dynamic";

export default async function EditService({ params }: { params: { id: string } }) {
  await requireAdmin();
  const id = decodeURIComponent(params.id);
  const isNew = id === "nouveau" && false;
  const entry = isNew ? null : (await listEntries<Service>("service")).entries.find((e) => e.id === id);
  if (!isNew && !entry) notFound();

  return (
    <div>
      <Link href="/admin/prestations" className="text-sm text-lin hover:text-ink">
        ← Prestations
      </Link>
      <h1 className="admin-h1 mt-2">{isNew ? "" : entry!.data.name}</h1>
      <div className="mt-6">
        <ServiceEditor initial={entry!.data} published={entry?.published ?? true} />
      </div>
    </div>
  );
}
