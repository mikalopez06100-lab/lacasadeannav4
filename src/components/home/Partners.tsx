import { partnerBrands } from "@/content/partners";
import { sites } from "@/content/site";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/**
 * Marques partenaires — double bandeau marquee infini :
 *   ligne du haut défile vers la droite, ligne du bas vers la gauche.
 * + passerelle vers le 2e site (La Casa de Anna · Maison, mobilier.lacasadeanna.com).
 */
function MarqueeRow({ reverse, duration }: { reverse?: boolean; duration: string }) {
  const items = partnerBrands.map((brand, i) => (
    <span key={i} className="flex items-center">
      <span className="font-display text-2xl text-ink/70 md:text-4xl">{brand}</span>
      <span className="mx-7 text-terre md:mx-10" aria-hidden="true">
        ✦
      </span>
    </span>
  ));

  return (
    <div className="marquee" aria-hidden="true">
      <div
        className={cn("marquee-track", reverse && "is-reverse")}
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {items}
        {items}
      </div>
    </div>
  );
}

export function Partners() {
  const maison = sites.maison;

  return (
    <section className="bg-sand py-24 md:py-32">
      <div className="container-x">
        <ScrollReveal>
          <p className="label text-lin">Marques partenaires</p>
          <h2 className="display-h2 mt-4 max-w-2xl">
            Une sélection d&apos;<span className="accent-italic">éditeurs</span>
          </h2>
        </ScrollReveal>
      </div>

      {/* Liste accessible (lue par Google / lecteurs d'écran), le visuel est le marquee */}
      <ul className="sr-only">
        {partnerBrands.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <div className="mt-14 flex flex-col gap-5 border-y border-ink/10 py-8">
        <MarqueeRow reverse duration="55s" />
        <MarqueeRow duration="48s" />
      </div>

      <div className="container-x">
        <ScrollReveal className="mt-14">
          <a
            href={maison.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex flex-wrap items-baseline gap-x-3 gap-y-1"
          >
            <span
              className="font-display text-2xl italic md:text-3xl"
             
            >
              Le catalogue mobilier sur La Casa de Anna · Maison
            </span>
            <span className="label whitespace-nowrap text-terre transition-transform group-hover:translate-x-1">
              {maison.live ? "Découvrir →" : "Bientôt →"}
            </span>
          </a>
          <p className="mt-2 text-sm text-lin">{maison.domain}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
