import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { listEntries, type Article } from "@/lib/content";
import { ArticleEditor } from "@/components/admin/editors";

export const dynamic = "force-dynamic";

export default async function EditArticle({ params }: { params: { id: string } }) {
  await requireAdmin();
  const id = decodeURIComponent(params.id);
  const isNew = id === "nouveau";
  const entry = isNew ? null : (await listEntries<Article>("article")).entries.find((e) => e.id === id);
  if (!isNew && !entry) notFound();

  return (
    <div>
      <Link href="/admin/journal" className="text-sm text-lin hover:text-ink">
        ← Journal
      </Link>
      <h1 className="admin-h1 mt-2">{isNew ? "Nouvel article" : entry!.data.title}</h1>
      {!isNew && (
        <Link href={`/journal/${entry!.id}`} target="_blank" className="text-sm text-terre hover:underline">
          Voir sur le site ↗
        </Link>
      )}
      <div className="mt-6">
        <ArticleEditor initial={entry?.data ?? null} published={entry?.published ?? true} />
      </div>
    </div>
  );
}
