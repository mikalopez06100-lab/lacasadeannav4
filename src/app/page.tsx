import Image from "next/image";
import { TextReveal } from "@/components/animations/TextReveal";
import { StudioIntro } from "@/components/home/StudioIntro";
import { Approach } from "@/components/home/Approach";
import { MaterialTransition } from "@/components/home/MaterialTransition";
import { ProjectRail, type RailItem } from "@/components/home/ProjectRail";
import { ProjectMarquee, type MarqueeItem } from "@/components/home/ProjectMarquee";
import { VideoSection } from "@/components/home/VideoSection";
import { Press } from "@/components/home/Press";
import { Testimonials } from "@/components/home/Testimonials";
import { Partners } from "@/components/home/Partners";
import { Collaborations } from "@/components/home/Collaborations";
import { Showroom } from "@/components/home/Showroom";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { resolveImage } from "@/lib/images";
import { projects } from "@/content/projects";
import { faq } from "@/content/faq";
import { faqSchema, jsonLd } from "@/lib/seo";

/** Home — structure V4 + demandes debrief client / Notion. */
export default async function HomePage() {
  const [teamImage, materialChene] = await Promise.all([
    resolveImage("team", { index: 2, variant: "lg" }),
    resolveImage("projects/home-veyrier-du-lac", { index: 12, variant: "full" }),
  ]);

  // Réalisations qui défilent : couverture + quelques vues par projet (hors rideaux)
  const marqueePicks: Record<string, number[]> = {
    "chalet-vue-lac": [49, 22, 26],
    "entre-lac-et-montagne": [12, 8, 2],
    "alpe-d-huez": [0, 3, 6],
    "comme-a-l-hotel": [0, 1],
    "menthon-saint-bernard": [0, 3],
  };
  const marqueeItems: MarqueeItem[] = (
    await Promise.all(
      projects.flatMap((p) =>
        (marqueePicks[p.slug] ?? []).map(async (index) => {
          const image = await resolveImage(p.imageCategory, { index, variant: "md" });
          return image ? { slug: p.slug, title: p.title, location: p.location, image } : null;
        }),
      ),
    )
  ).filter((item): item is MarqueeItem => item !== null);
  // Alterne les projets pour que deux vues du même lieu ne se suivent pas
  const marqueeOrder = marqueeItems
    .map((item, i) => ({ item, rank: marqueeItems.slice(0, i).filter((x) => x.slug === item.slug).length }))
    .sort((a, b) => a.rank - b.rank)
    .map(({ item }) => item);

  const railItems: RailItem[] = await Promise.all(
    projects.map(async (p) => ({
      slug: p.slug,
      title: p.title,
      location: p.location,
      year: p.year,
      type: p.type,
      cover: await resolveImage(p.imageCategory, { index: p.coverIndex ?? 0, variant: "md" }),
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(faq)) }}
      />

      {/* 01 — Hero (photo d'accueil Notion) */}
      <section className="relative flex h-svh min-h-[640px] items-center justify-center overflow-hidden bg-cream">
        <Image
          src="/assets/img/hero/accueil-wide.jpg"
          alt="Natalia et Coline sur la balcon — La Casa de Anna"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/30" />
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
            <>Imaginer sans limite,</>,
            <>
              <span className="accent-italic">concevoir sans rien laisser au hasard.</span>
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

      {/* 03 — Réalisations qui défilent (remplace la transition « rideau », brief v2) */}
      <ProjectMarquee items={marqueeOrder} />

      {/* 04 — Studio */}
      <StudioIntro image={teamImage} />

      {/* 05 — Approche */}
      <Approach />

      {/* 06 — Transition matière */}
      {materialChene && (
        <MaterialTransition src={materialChene.src} alt="Chêne massif — mobilier sur mesure" />
      )}

      {/* 07 — Projets */}
      <ProjectRail items={railItems} />

      {/* 08 — Vidéo Notion */}
      <VideoSection
        src="/assets/video/natalia-studio.mp4"
        poster="/assets/img/video-poster.jpg"
        alt="Présentation du studio La Casa de Anna — Natalia"
      />

      {/* 09 — Presse feuilletable */}
      <Press />

      {/* 10 — Témoignages */}
      <Testimonials />

      {/* 10b — Marques */}
      <Partners />

      {/* 10c — Showroom Bluffy */}
      <Showroom />

      {/* 10d — Collaborations (bureaux partagés à Bluffy) */}
      <Collaborations />

      {/* 11 — FAQ */}
      <Faq />

      {/* 12 — CTA final */}
      <FinalCta />
    </>
  );
}
