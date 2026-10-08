import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { FinalCta } from "@/components/home/FinalCta";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { RevealImage } from "@/components/animations/RevealImage";
import { journal, articleImage } from "@/content/journal";
import { resolveImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Journal — conseils & inspiration design d'intérieur",
  description:
    "Le journal de La Casa de Anna : conseils pour choisir son architecte d'intérieur à Annecy, matières naturelles, rideaux sur mesure, rénovation et quiet luxury.",
  alternates: { canonical: "/journal" },
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function JournalPage() {
  const sorted = [...journal].sort((a, b) => b.date.localeCompare(a.date));
  const articles = await Promise.all(
    sorted.map(async (a) => {
      const ref = articleImage[a.slug];
      const image = ref
        ? await resolveImage(ref.category, { index: ref.index, variant: "md" })
        : null;
      return { article: a, image };
    }),
  );

  return (
    <>
      <PageHeader
        label="Journal"
        title={
          <>
            Conseils & <span className="accent-italic">inspiration</span>
          </>
        }
        intro="Nos réflexions sur le design d'intérieur, les matières et le métier — pour vous aider à penser votre projet, à Annecy comme ailleurs."
      />

      <section className="container-x grid gap-x-8 gap-y-16 pb-8 md:grid-cols-2 md:gap-y-20">
        {articles.map(({ article: a, image }, i) => (
          <ScrollReveal key={a.slug} delay={(i % 2) * 0.08}>
            <Link href={`/journal/${a.slug}`} className="group block">
              {image && (
                <RevealImage
                  src={image.src}
                  alt={a.title}
                  className="aspect-[3/2] w-full"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              )}
              <div className="mt-5 flex items-center gap-3">
                <span className="label text-terre">{a.category}</span>
                <span className="label text-lin">{dateFmt.format(new Date(a.date))}</span>
              </div>
              <h2 className="mt-3 font-display text-2xl transition-colors group-hover:text-terre md:text-3xl">
                {a.title}
              </h2>
              <p className="mt-3 text-lin">{a.excerpt}</p>
              <span className="label mt-5 inline-block border-b border-ink pb-1 transition-colors group-hover:border-terre group-hover:text-terre">
                Lire →
              </span>
            </Link>
          </ScrollReveal>
        ))}
      </section>

      <FinalCta />
    </>
  );
}
