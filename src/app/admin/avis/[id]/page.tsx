import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { listEntries, type Testimonial } from "@/lib/content";
import { TestimonialEditor } from "@/components/admin/editors";

export const dynamic = "force-dynamic";

export default async function EditTestimonial({ params }: { params: { id: string } }) {
  await requireAdmin();
  const id = decodeURIComponent(params.id);
  const isNew = id === "nouveau";
  const entry = isNew ? null : (await listEntries<Testimonial>("testimonial")).entries.find((e) => e.id === id);
  if (!isNew && !entry) notFound();

  return (
    <div>
      <Link href="/admin/avis" className="text-sm text-lin hover:text-ink">
        ← Avis clients
      </Link>
      <h1 className="admin-h1 mt-2">{isNew ? "Nouvel avis" : entry!.data.author}</h1>
      <div className="mt-6">
        <TestimonialEditor initial={entry?.data ?? null} published={entry?.published ?? true} />
      </div>
    </div>
  );
}
