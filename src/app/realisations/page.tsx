import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { FinalCta } from "@/components/home/FinalCta";
import { ProjectsGrid, type GridItem } from "@/components/realisations/ProjectsGrid";
import { projects } from "@/content/projects";
import { resolveImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Réalisations — projets de design d'intérieur",
  description:
    "Les réalisations du studio La Casa de Anna : rénovations, décorations et mobilier sur mesure à Annecy, en Haute-Savoie et au-delà. Maisons, appartements et projets sur mesure.",
  alternates: { canonical: "/realisations" },
};

export default async function RealisationsPage() {
  const items: GridItem[] = await Promise.all(
    projects.map(async (p) => ({
      slug: p.slug,
      title: p.title,
      location: p.location,
      area: p.area,
      year: p.year,
      type: p.type,
      cover: await resolveImage(p.imageCategory, { index: 0, variant: "md" }),
    })),
  );

  return (
    <>
      <PageHeader
        label="Réalisations"
        title={
          <>
            Des lieux <span className="accent-italic">habités</span>
          </>
        }
        intro="Chaque projet est une rencontre. Voici quelques intérieurs conçus par le studio — en Haute-Savoie et ailleurs. D'autres réalisations viendront enrichir cette sélection au fil des prochaines publications."
      />
      <ProjectsGrid items={items} />
      <FinalCta />
    </>
  );
}
