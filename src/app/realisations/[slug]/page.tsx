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
  const hero = variant(images[0], "full");
  const gallery = images
    .slice(1)
    .map((img) => variant(img, "lg")?.path)
    .filter((p): p is string => Boolean(p));

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

      {/* Galerie — alternance pleine largeur / 2 colonnes */}
      <section className="flex flex-col gap-4 md:gap-6">
        {chunkGallery(gallery).map((row, idx) =>
          row.length === 1 ? (
            <GalleryImage key={idx} src={row[0]} alt={project.title} full />
          ) : (
            <div key={idx} className="grid grid-cols-2 gap-4 md:gap-6">
              {row.map((src, j) => (
                <GalleryImage key={j} src={src} alt={project.title} />
              ))}
            </div>
          ),
        )}
      </section>

      {/* Matières utilisées */}
      <section className="container-x py-20 md:py-28">
        <p className="label text-lin">Matières utilisées</p>
        <ul className="mt-8 grid gap-x-12 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
          {project.materials.map((m) => (
            <li key={m.name} className="border-t border-ink/10 pt-4">
              <span className="font-fraunces text-xl">{m.name}</span>
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
              className="mx-auto max-w-4xl font-fraunces text-3xl italic leading-snug md:text-4xl"
              style={{ fontVariationSettings: "'WONK' 1" }}
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

/** Regroupe la galerie : 1 image pleine largeur, puis 2 côte à côte, en alternance. */
function chunkGallery<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  let idx = 0;
  let full = true;
  while (idx < items.length) {
    if (full) {
      rows.push([items[idx]]);
      idx += 1;
    } else {
      rows.push(items.slice(idx, idx + 2));
      idx += 2;
    }
    full = !full;
  }
  return rows;
}

function GalleryImage({
  src,
  alt,
  full = false,
}: {
  src: string;
  alt: string;
  full?: boolean;
}) {
  return (
    <div
      className={
        full
          ? "relative aspect-[16/9] w-full overflow-hidden bg-sand"
          : "relative aspect-[4/5] w-full overflow-hidden bg-sand"
      }
    >
      <Image src={src} alt={alt} fill sizes={full ? "100vw" : "50vw"} className="object-cover" />
    </div>
  );
}
