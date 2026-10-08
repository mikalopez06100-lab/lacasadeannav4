import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { Approach } from "@/components/home/Approach";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCta } from "@/components/home/FinalCta";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { team } from "@/content/team";
import { resolveImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Le studio — Natalia Vastel & Coline Rouvière",
  description:
    "Le duo derrière La Casa de Anna : Natalia Vastel et Coline Rouvière, studio de design d'intérieur ancré au bord du lac d'Annecy, intervenant partout en France et à l'international.",
  alternates: { canonical: "/studio" },
};

export default async function StudioPage() {
  const portraits = await Promise.all([
    resolveImage("team", { index: 0, variant: "lg" }),
    resolveImage("team", { index: 5, variant: "lg" }),
  ]);

  return (
    <>
      <PageHeader
        label="Le studio"
        title={
          <>
            Un duo, <span className="accent-italic">une exigence</span>
          </>
        }
        intro="Natalia Vastel et Coline Rouvière forment La Casa de Anna — un studio de design d'intérieur fondé en 2021, ancré à Veyrier-du-Lac au bord du lac d'Annecy, mais sans frontières. Conception, mobilier sur mesure, rideaux confectionnés et suivi de chantier, en Haute-Savoie comme partout où un projet les appelle."
      />

      <section className="container-x grid gap-16 pb-24 md:grid-cols-2 md:gap-12">
        {team.map((member, i) => (
          <ScrollReveal key={member.name} delay={i * 0.05}>
            <div className="relative aspect-[4/5] overflow-hidden bg-sand">
              {portraits[i] && (
                <Image
                  src={portraits[i]!.src}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>
            <h2 className="mt-6 font-display text-3xl italic">
              {member.name}
            </h2>
            <p className="label mt-2 text-lin">{member.role}</p>
            <p className="mt-4 max-w-prose text-lin">{member.bio}</p>
          </ScrollReveal>
        ))}
      </section>

      <Approach />
      <Testimonials />
      <FinalCta />
    </>
  );
}
