import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { listEntries, type FaqItem } from "@/lib/content";
import { FaqEditor } from "@/components/admin/editors";

export const dynamic = "force-dynamic";

export default async function EditFaqItem({ params }: { params: { id: string } }) {
  await requireAdmin();
  const id = decodeURIComponent(params.id);
  const isNew = id === "nouveau";
  const entry = isNew ? null : (await listEntries<FaqItem>("faq")).entries.find((e) => e.id === id);
  if (!isNew && !entry) notFound();

  return (
    <div>
      <Link href="/admin/faq" className="text-sm text-lin hover:text-ink">
        ← FAQ
      </Link>
      <h1 className="admin-h1 mt-2">{isNew ? "Nouvelle question" : "Modifier la question"}</h1>
      <div className="mt-6">
        <FaqEditor initial={entry?.data ?? null} published={entry?.published ?? true} />
      </div>
    </div>
  );
}
