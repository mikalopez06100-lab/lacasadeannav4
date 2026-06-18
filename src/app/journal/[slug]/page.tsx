import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { journal, getArticle, articleImage } from "@/content/journal";
import { site } from "@/content/site";
import { jsonLd } from "@/lib/seo";
import { resolveImage } from "@/lib/images";
import { FinalCta } from "@/components/home/FinalCta";

export function generateStaticParams() {
  return journal.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
    },
  };
}

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const ref = articleImage[article.slug];
  const cover = ref
    ? await resolveImage(ref.category, { index: ref.index, variant: "full" })
    : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    articleSection: article.category,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/journal/${article.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />

      <header className="container-x pb-12 pt-36 md:pt-48">
        <div className="flex items-center gap-3">
          <span className="label text-terre">{article.category}</span>
          <span className="label text-lin">{dateFmt.format(new Date(article.date))}</span>
        </div>
        <h1 className="display-h1 mt-5 max-w-4xl">{article.title}</h1>
      </header>

      {cover && (
        <div className="relative mb-16 aspect-[16/9] w-full overflow-hidden bg-sand md:mb-24">
          <Image src={cover.src} alt={article.title} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}

      <div className="container-x pb-20 md:pb-28">
        <div className="mx-auto max-w-prose space-y-6 text-lg leading-relaxed">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <p className="mx-auto mt-16 max-w-prose">
          <Link
            href="/journal"
            className="label border-b border-ink pb-1 transition-colors hover:border-terre hover:text-terre"
          >
            ← Tous les articles
          </Link>
        </p>
      </div>

      <FinalCta />
    </article>
  );
}
