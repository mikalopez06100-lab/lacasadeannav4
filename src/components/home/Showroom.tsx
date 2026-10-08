import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { site } from "@/content/site";

const gallery = [
  {
    src: "/assets/img/showroom/showroom-dining.webp",
    alt: "Espace repas du showroom — table marbre et suspension plissée",
  },
  {
    src: "/assets/img/showroom/showroom-detail.webp",
    alt: "Détail showroom — fauteuil cuir et béton texturé",
  },
  {
    src: "/assets/img/showroom/showroom-night.webp",
    alt: "Showroom vu de nuit — lumière et matières",
  },
] as const;

/** Showroom Bluffy + collègues du bureau (debrief client). */
export function Showroom() {
  return (
    <section id="showroom" className="bg-sand py-24 md:py-32">
      <div className="container-x grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <ScrollReveal className="relative aspect-[4/3] overflow-hidden bg-cream">
          <Image
            src="/assets/img/showroom/showroom-hero.webp"
            alt="Notre showroom au bord du lac — salon et matériauthèque, Bluffy"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </ScrollReveal>

        <ScrollReveal>
          <p className="label text-lin">Notre showroom au bord du lac</p>
          <h2 className="display-h2 mt-4">
            Bureau &amp; showroom
          </h2>
          <p className="mt-6 max-w-prose text-lin">
            Venez découvrir matières, mobilier et ambiance dans notre espace partagé
            à Bluffy — au bord du lac d&apos;Annecy.
          </p>
          <p className="mt-6 font-display text-xl leading-relaxed">
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}
          </p>
          <Link
            href="/contact"
            className="label mt-8 inline-block bg-terre px-7 py-3.5 text-cream transition-colors hover:bg-ink"
          >
            Prendre rendez-vous
          </Link>

          <div className="mt-12 border-t border-ink/10 pt-8">
            <p className="label text-lin">Nos collègues du bureau</p>
            <div className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
              <a
                href="https://www.ncdesignstudio.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-2xl transition-colors hover:text-terre"
              >
                Dream Design Build
              </a>
              <a
                href="https://www.ncdesignstudio.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-2xl transition-colors hover:text-terre"
                title="Aménagements extérieurs & paysagers"
              >
                Arbolya
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="container-x mt-14 grid gap-4 md:grid-cols-3">
        {gallery.map((img) => (
          <ScrollReveal key={img.src} className="relative aspect-[3/4] overflow-hidden bg-cream">
            <Image src={img.src} alt={img.alt} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
