import Image from "next/image";
import { TextReveal } from "@/components/animations/TextReveal";
import { StudioIntro } from "@/components/home/StudioIntro";
import { Approach } from "@/components/home/Approach";
import { MaterialTransition } from "@/components/home/MaterialTransition";
import { ProjectRail, type RailItem } from "@/components/home/ProjectRail";
import { VideoSection } from "@/components/home/VideoSection";
import { Press } from "@/components/home/Press";
import { Testimonials } from "@/components/home/Testimonials";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { resolveImage } from "@/lib/images";
import { projects } from "@/content/projects";
import { faq } from "@/content/faq";
import { faqSchema, jsonLd } from "@/lib/seo";

/** Home (brief §7) — structure complète des 13 sections. */
export default async function HomePage() {
  const [hero, teamImage, materialLin, materialChene, videoPoster] =
    await Promise.all([
      resolveImage("projects/home-veyrier-du-lac", { index: 0, variant: "full" }),
      resolveImage("team", { index: 2, variant: "lg" }),
      resolveImage("projects/rideaux", { index: 0, variant: "full" }),
      resolveImage("projects/home-veyrier-du-lac", { index: 12, variant: "full" }),
      resolveImage("projects/veyrier-lauflo", { index: 1, variant: "full" }),
    ]);

  const railItems: RailItem[] = await Promise.all(
    projects.map(async (p) => ({
      slug: p.slug,
      title: p.title,
      location: p.location,
      year: p.year,
      type: p.type,
      cover: await resolveImage(p.imageCategory, { index: 0, variant: "md" }),
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(faq)) }}
      />

      {/* 01 — Hero */}
      <section className="relative flex h-svh min-h-[640px] items-center justify-center overflow-hidden bg-cream">
        {hero && (
          <Image
            src={hero.src}
            alt="Intérieur réalisé par La Casa de Anna — maison au bord du lac d'Annecy"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-ink/25" />
        <div className="container-x relative z-10 text-center text-cream">
          <p className="label mb-6 text-cream/80">Studio de design d&apos;intérieur</p>
          <TextReveal
            as="h1"
            className="display-tagline !text-cream"
            start="top 100%"
            delay={0.3}
            lines={[
              <>Des intérieurs</>,
              <>
                qui <span className="accent-italic !text-cream">racontent une vie</span>.
              </>,
            ]}
          />
        </div>
      </section>

      {/* 02 — Manifeste */}
      <section className="container-x flex min-h-[80vh] flex-col items-center justify-center py-32 text-center">
        <TextReveal
          as="p"
          className="display-tagline"
          lines={[
            <>Du premier croquis</>,
            <>
              au <span className="accent-italic">dernier coussin</span>.
            </>,
          ]}
        />
        <p className="mt-10 max-w-prose text-balance text-lin">
          La Casa de Anna conçoit des intérieurs sur mesure entre lac, montagne et
          bien au-delà — Annecy, Paris, la Corse, et partout où un projet nous appelle.
          Natalia et Coline imaginent, dessinent et orchestrent chaque détail, sur place
          comme à distance.
        </p>
      </section>

      {/* 03 — Transition matière (lin / textile) */}
      {materialLin && (
        <MaterialTransition src={materialLin.src} alt="Lin écru — confection sur mesure" />
      )}

      {/* 04 — Studio (duo) */}
      <StudioIntro image={teamImage} />

      {/* 05 — Approche */}
      <Approach />

      {/* 06 — Transition matière (chêne / bois) */}
      {materialChene && (
        <MaterialTransition src={materialChene.src} alt="Chêne massif — mobilier sur mesure" />
      )}

      {/* 07 — Projets phares (rail drag) */}
      <ProjectRail items={railItems} />

      {/* 08 — Vidéo / matière en mouvement (poster réel en attendant les vidéos) */}
      {videoPoster && (
        <VideoSection poster={videoPoster.src} alt="Détail d'une réalisation La Casa de Anna" />
      )}

      {/* 09 — Presse */}
      <Press />

      {/* 10 — Témoignages */}
      <Testimonials />

      {/* 11 — FAQ */}
      <Faq />

      {/* 12 — CTA final */}
      <FinalCta />
    </>
  );
}
