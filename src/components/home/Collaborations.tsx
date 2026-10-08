import Image from "next/image";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { collaborations } from "@/content/collaborations";
import { sites } from "@/content/site";

/**
 * Nos collaborations (brief client v2) — partenaires des bureaux de Bluffy.
 * Mise en page reprise du bloc « Nos collaborations » d'arbolya.fr :
 * titre + texte, puis une rangée de cartes logo cliquables.
 */
export function Collaborations() {
  const maison = sites.maison;

  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <ScrollReveal className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-end">
          <div>
            <p className="label text-lin">Nos collaborations</p>
            <h2 className="display-h2 mt-4">
              Une même exigence,
              <br />
              <span className="accent-italic">plusieurs savoir-faire.</span>
            </h2>
          </div>
          <p className="max-w-prose text-lin md:pb-2">
            Architecte, paysagiste, constructeur : nous partageons nos bureaux de Bluffy
            avec des partenaires de confiance. Ensemble, nous réunissons les expertises
            qui donnent à chaque projet sa cohérence.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {collaborations.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="collab-card group"
            >
              <span className="flex flex-1 items-center justify-center">
                <Image
                  src={c.logo.src}
                  alt={c.name}
                  width={c.logo.width}
                  height={c.logo.height}
                  className="collab-logo"
                />
              </span>
              <span className="label text-center text-lin transition-colors group-hover:text-terre">
                {c.role} ↗
              </span>
            </a>
          ))}

          <a
            href={maison.live ? maison.url : "#showroom"}
            target={maison.live ? "_blank" : undefined}
            rel={maison.live ? "noopener noreferrer" : undefined}
            className="collab-card group"
          >
            <span className="flex flex-1 items-center justify-center">
              <Image
                src="/assets/brand/logo-black.webp"
                alt="La Casa de Anna — mobilier & showroom"
                width={1462}
                height={676}
                className="collab-logo"
              />
            </span>
            <span className="label text-center text-lin transition-colors group-hover:text-terre">
              Mobilier &amp; showroom {maison.live ? "↗" : "· bientôt"}
            </span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
