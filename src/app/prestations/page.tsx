import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { FinalCta } from "@/components/home/FinalCta";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { RevealImage } from "@/components/animations/RevealImage";
import { services, serviceImage } from "@/content/services";
import { resolveImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Prestations — consultation, conception, clé-en-main",
  description:
    "Les formules du studio La Casa de Anna : consultation 3 h (790 €), dossier de conception, clé-en-main, mobilier sur mesure, rideaux confectionnés et projets professionnels. Partout en France.",
  alternates: { canonical: "/prestations" },
};

export default async function PrestationsPage() {
  const items = await Promise.all(
    services.map(async (s) => {
      const ref = serviceImage[s.id];
      const image = ref
        ? await resolveImage(ref.category, { index: ref.index, variant: "md" })
        : null;
      return { service: s, image };
    }),
  );

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

      <section className="container-x grid gap-x-8 gap-y-16 pb-8 md:grid-cols-2 md:gap-y-24">
        {items.map(({ service: s, image }, i) => (
          <ScrollReveal key={s.id} id={s.id} delay={(i % 2) * 0.08} className="scroll-mt-32">
            {image && (
              <RevealImage
                src={image.src}
                alt={s.name}
                className="aspect-[4/3] w-full"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            )}

            <div className="mt-6 flex items-baseline justify-between gap-4">
              <span
                className="font-display text-3xl italic text-lin"
               
              >
                {s.index}
              </span>
              <span className="label text-terre">
                {s.price ?? "Sur devis"}
                {s.duration && <span className="text-lin"> · {s.duration}</span>}
              </span>
            </div>

            <h2 className="mt-3 font-display text-2xl md:text-3xl">{s.name}</h2>
            <p className="mt-3 text-lin">{s.description}</p>

            <ul className="mt-5 space-y-2">
              {s.deliverables.map((d) => (
                <li key={d} className="flex gap-3 text-sm">
                  <span className="text-terre" aria-hidden="true">—</span>
                  {d}
                </li>
              ))}
            </ul>

            <Link
              href={s.cta.href}
              className="label mt-7 inline-block border-b border-ink pb-1 transition-colors hover:border-terre hover:text-terre"
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
