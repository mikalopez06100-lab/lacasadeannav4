import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import { imagesByCategory, variant } from "@/lib/images";
import { site } from "@/content/site";
import { jsonLd } from "@/lib/seo";
import { FinalCta } from "@/components/home/FinalCta";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = getProject(params.slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.location}`,
    description: project.excerpt,
    alternates: { canonical: `/realisations/${project.slug}` },
    openGraph: { title: project.title, description: project.excerpt },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const images = await imagesByCategory(project.imageCategory);
  const coverIndex = project.coverIndex ?? 0;
  const excluded = new Set([coverIndex, ...(project.excludeImages ?? [])]);
  const hero = variant(images[coverIndex], "full");
  const gallery = images
    .filter((_, idx) => !excluded.has(idx))
    .map((img) => variant(img, "lg"))
    .filter((o): o is NonNullable<typeof o> => Boolean(o))
    .map((o) => ({ src: o.path, width: o.width ?? 1200, height: o.height ?? 1500 }));

  const i = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.excerpt,
    locationCreated: project.location,
    dateCreated: String(project.year),
    creator: { "@type": "Organization", name: site.name, url: site.url },
    image: hero ? `${site.url}${hero.path}` : undefined,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />

      <header className="container-x pb-12 pt-36 md:pt-48">
        <p className="label text-lin">
          {project.type} · {project.location} · {project.year}
        </p>
        <h1 className="display-h1 mt-4">{project.title}</h1>
      </header>

      {hero && (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand">
          <Image
            src={hero.path}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Contexte (300-500 mots — SEO) */}
      <section className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-prose space-y-6 text-lg leading-relaxed">
          {project.body.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </section>

      {/* Galerie — rangées 1 / 2 / 3 photos, formats respectés (pas de recadrage) */}
      <section className="container-x flex flex-col gap-3 md:gap-5">
        {chunkGallery(gallery).map((row, idx) => (
          <div key={idx} className="flex flex-col gap-3 md:flex-row md:gap-5">
            {row.map((img, j) => (
              <GalleryImage
                key={j}
                image={img}
                alt={`${project.title} — ${project.location} (photo ${idx + 1}.${j + 1})`}
                perRow={row.length}
              />
            ))}
          </div>
        ))}
      </section>

      {/* Matières utilisées */}
      <section className="container-x py-20 md:py-28">
        <p className="label text-lin">Matières utilisées</p>
        <ul className="mt-8 grid gap-x-12 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
          {project.materials.map((m) => (
            <li key={m.name} className="border-t border-ink/10 pt-4">
              <span className="font-display text-xl">{m.name}</span>
              {m.note && <span className="mt-1 block text-sm text-lin">{m.note}</span>}
            </li>
          ))}
        </ul>
      </section>

      {/* Témoignage client */}
      {project.testimonial && (
        <section data-cursor-dark className="bg-ink py-24 text-center text-cream md:py-28">
          <div className="container-x">
            <blockquote
              className="mx-auto max-w-4xl font-display text-3xl italic leading-snug md:text-4xl"
             
            >
              «&nbsp;{project.testimonial.quote}&nbsp;»
            </blockquote>
            <p className="label mt-8 text-lin">{project.testimonial.author}</p>
          </div>
        </section>
      )}

      {/* Navigation projet précédent / suivant */}
      <nav className="container-x flex items-center justify-between border-t border-ink/10 py-10">
        <Link href={`/realisations/${prev.slug}`} className="label text-lin transition-colors hover:text-terre">
          ← {prev.title}
        </Link>
        <Link href={`/realisations/${next.slug}`} className="label text-lin transition-colors hover:text-terre">
          {next.title} →
        </Link>
      </nav>

      <FinalCta />
    </article>
  );
}

type GalleryItem = { src: string; width: number; height: number };

/**
 * Regroupe la galerie en rangées de 1, 2, 3, 2… photos.
 * Une photo verticale ne reste jamais seule en pleine largeur : on la groupe avec la suivante.
 */
function chunkGallery(items: GalleryItem[]): GalleryItem[][] {
  const pattern = [1, 2, 3, 2];
  const rows: GalleryItem[][] = [];
  let idx = 0;
  let r = 0;
  while (idx < items.length) {
    let n = pattern[r++ % pattern.length];
    if (n === 1 && items[idx].height > items[idx].width) n = 2;
    rows.push(items.slice(idx, idx + n));
    idx += n;
  }
  return rows;
}

/** Chaque photo occupe une largeur proportionnelle à son ratio : la rangée a une hauteur commune. */
function GalleryImage({
  image,
  alt,
  perRow,
}: {
  image: GalleryItem;
  alt: string;
  perRow: number;
}) {
  const ratio = image.width / image.height;
  return (
    <div
      className="relative w-full overflow-hidden bg-sand md:w-auto"
      style={{ flex: `${ratio} 1 0%`, aspectRatio: String(ratio) }}
    >
      <Image
        src={image.src}
        alt={alt}
        fill
        sizes={perRow === 1 ? "100vw" : `(max-width: 768px) 100vw, ${Math.round(100 / perRow)}vw`}
        className="object-cover"
      />
    </div>
  );
}
