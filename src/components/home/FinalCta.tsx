import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/** CTA final (brief §7 section 12) — « Votre projet commence ici ». */
export function FinalCta() {
  return (
    <section className="container-x py-28 text-center md:py-40">
      <ScrollReveal>
        <p
          className="display-tagline"
          style={{ fontVariationSettings: "'WONK' 1" }}
        >
          Votre projet <span className="accent-italic">commence ici</span>.
        </p>
        <p className="mx-auto mt-8 max-w-prose text-lin">
          Une consultation de 3 h pour poser les bases, à domicile ou en visio.
          Où que vous soyez, en Haute-Savoie comme ailleurs en France.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="label bg-terre px-7 py-4 text-cream transition-colors duration-300 ease-soft hover:bg-ink"
          >
            Démarrer un projet
          </Link>
          <Link
            href="/prestations"
            className="label border-b border-ink pb-1 transition-colors hover:border-terre hover:text-terre"
          >
            Voir les prestations →
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
