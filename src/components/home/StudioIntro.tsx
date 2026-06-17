import Image from "next/image";
import Link from "next/link";
import { studioIntro } from "@/content/team";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/** Présentation du duo en home (brief §7 section 04) — portrait éditorial + texte court. */
export function StudioIntro({
  image,
}: {
  image: { src: string; width: number; height: number } | null;
}) {
  return (
    <section className="container-x grid items-center gap-12 py-24 md:grid-cols-2 md:gap-20 md:py-32">
      <ScrollReveal>
        <p className="label text-lin">{studioIntro.label}</p>
        <h2 className="display-h2 mt-4">
          Un duo, <span className="accent-italic">une exigence</span>
        </h2>
        <p className="mt-6 max-w-prose text-lin">{studioIntro.text}</p>
        <Link
          href="/studio"
          className="label mt-8 inline-block border-b border-ink pb-1 transition-colors hover:border-terre hover:text-terre"
        >
          Découvrir le duo →
        </Link>
      </ScrollReveal>

      <ScrollReveal y={24} className="relative aspect-[4/5] overflow-hidden bg-sand">
        {image && (
          <Image
            src={image.src}
            alt="Natalia Vastel et Coline Rouvière — La Casa de Anna"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </ScrollReveal>
    </section>
  );
}
