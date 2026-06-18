import { partnerBrands } from "@/content/partners";
import { sites } from "@/content/site";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/**
 * Marques partenaires + passerelle vers le 2e site (La Casa de Anna · Maison).
 * Le sous-domaine mobilier.lacasadeanna.com sera développé ensuite — lien prêt,
 * signalé « Bientôt » tant que `sites.maison.live` est faux.
 */
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
          <p className="mt-6 max-w-prose text-lin">
            Nous prescrivons et distribuons un choix resserré de maisons d&apos;édition,
            pour leur exigence de fabrication et la justesse de leurs matières.
          </p>
        </ScrollReveal>

        <ScrollReveal y={24} className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/10 pt-8">
          {partnerBrands.map((brand) => (
            <span key={brand} className="font-fraunces text-xl text-ink/80 md:text-2xl">
              {brand}
            </span>
          ))}
        </ScrollReveal>

        <ScrollReveal className="mt-12">
          <a
            href={maison.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-baseline gap-3"
          >
            <span className="font-fraunces text-2xl italic md:text-3xl" style={{ fontVariationSettings: "'WONK' 1" }}>
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
