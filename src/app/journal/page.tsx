import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { FinalCta } from "@/components/home/FinalCta";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { journal } from "@/content/journal";

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

export default function JournalPage() {
  const articles = [...journal].sort((a, b) => b.date.localeCompare(a.date));

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

      <section className="container-x grid gap-px overflow-hidden border-y border-ink/10 bg-ink/10 pb-0 md:grid-cols-2">
        {articles.map((a) => (
          <ScrollReveal key={a.slug} className="bg-cream">
            <Link href={`/journal/${a.slug}`} className="group flex h-full flex-col p-8 md:p-12">
              <div className="flex items-center gap-3">
                <span className="label text-terre">{a.category}</span>
                <span className="label text-lin">
                  {dateFmt.format(new Date(a.date))}
                </span>
              </div>
              <h2 className="mt-5 font-fraunces text-2xl transition-colors group-hover:text-terre md:text-3xl">
                {a.title}
              </h2>
              <p className="mt-4 text-lin">{a.excerpt}</p>
              <span className="label mt-6 inline-block border-b border-ink pb-1 transition-colors group-hover:border-terre group-hover:text-terre">
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
