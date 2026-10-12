import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { FinalCta } from "@/components/home/FinalCta";
import { ProjectsGrid, type GridItem } from "@/components/realisations/ProjectsGrid";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Réalisations — projets de design d'intérieur",
  description:
    "Les réalisations du studio La Casa de Anna : rénovations, décorations et mobilier sur mesure à Annecy, en Haute-Savoie et au-delà. Maisons, appartements et projets sur mesure.",
  alternates: { canonical: "/realisations" },
};

export default async function RealisationsPage() {
  const items: GridItem[] = (await getProjects()).map((p) => ({
    slug: p.slug,
    title: p.title,
    location: p.location,
    area: p.area,
    year: p.year,
    type: p.type,
    status: p.status,
    cover: p.images[0] ?? null,
  }));

  return (
    <>
      <PageHeader
        label="Réalisations"
        title={
          <>
            Des lieux <span className="accent-italic">habités</span>
          </>
        }
        intro="Chaque projet est une rencontre. Voici quelques intérieurs conçus par le studio — au bord du lac d'Annecy, en montagne et ailleurs. Cliquez sur un projet pour découvrir ses photos et son histoire."
      />
      <ProjectsGrid items={items} />
      <FinalCta />
    </>
  );
}
