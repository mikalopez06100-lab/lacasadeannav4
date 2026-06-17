import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { FinalCta } from "@/components/home/FinalCta";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Prestations — consultation, conception, clé-en-main",
  description:
    "Les formules du studio La Casa de Anna : consultation 3 h (790 €), dossier de conception, clé-en-main, mobilier sur mesure, rideaux confectionnés et projets professionnels. Partout en France.",
  alternates: { canonical: "/prestations" },
};

export default function PrestationsPage() {
  return (
    <>
      <PageHeader
        label="Prestations"
        title={
          <>
            Six façons de <span className="accent-italic">travailler ensemble</span>
          </>
        }
        intro="De la consultation ponctuelle au projet clé-en-main, le studio s'adapte à votre besoin et à votre budget. Chaque formule peut être combinée — beaucoup de projets démarrent par une simple consultation."
      />

      <section className="container-x grid gap-px overflow-hidden border-y border-ink/10 bg-ink/10 md:grid-cols-2">
        {services.map((s) => (
          <ScrollReveal
            key={s.id}
            id={s.id}
            className="scroll-mt-32 bg-cream p-8 md:p-12"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-fraunces text-4xl italic text-lin" style={{ fontVariationSettings: "'WONK' 1" }}>
                {s.index}
              </span>
              <span className="label text-terre">
                {s.price ?? "Sur devis"}
                {s.duration && <span className="text-lin"> · {s.duration}</span>}
              </span>
            </div>

            <h2 className="mt-4 font-fraunces text-2xl md:text-3xl">{s.name}</h2>
            <p className="mt-4 text-lin">{s.description}</p>

            <ul className="mt-6 space-y-2">
              {s.deliverables.map((d) => (
                <li key={d} className="flex gap-3 text-sm">
                  <span className="text-terre" aria-hidden="true">
                    —
                  </span>
                  {d}
                </li>
              ))}
            </ul>

            <Link
              href={s.cta.href}
              className="label mt-8 inline-block border-b border-ink pb-1 transition-colors hover:border-terre hover:text-terre"
            >
              {s.cta.label} →
            </Link>
          </ScrollReveal>
        ))}
      </section>

      <FinalCta />
    </>
  );
}
