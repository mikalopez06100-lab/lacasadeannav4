import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site La Casa de Anna.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHeader label="Informations" title="Mentions légales" />
      <div className="container-x max-w-prose space-y-8 pb-28 text-lin">
        <section>
          <h2 className="font-fraunces text-xl text-ink">Éditeur</h2>
          <p className="mt-3 leading-relaxed">
            La Casa de Anna — SARL au capital social variable, immatriculée depuis{" "}
            {site.founded}.<br />
            Siège : {site.address.street}, {site.address.postalCode}{" "}
            {site.address.city}, France.<br />
            SIRET : <em>[à compléter]</em> — TVA intracommunautaire :{" "}
            <em>[à compléter]</em>.<br />
            E-mail : {site.email} — Téléphone : {site.phoneDisplay}.
          </p>
        </section>
        <section>
          <h2 className="font-fraunces text-xl text-ink">Directrices de la publication</h2>
          <p className="mt-3 leading-relaxed">
            Natalia Vastel et Coline Rouvière, co-gérantes.
          </p>
        </section>
        <section>
          <h2 className="font-fraunces text-xl text-ink">Hébergement</h2>
          <p className="mt-3 leading-relaxed">
            Site hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723,
            États-Unis — vercel.com.
          </p>
        </section>
        <section>
          <h2 className="font-fraunces text-xl text-ink">Propriété intellectuelle</h2>
          <p className="mt-3 leading-relaxed">
            L&apos;ensemble des contenus de ce site (textes, photographies, identité
            visuelle) est la propriété de La Casa de Anna ou de ses ayants droit. Toute
            reproduction sans autorisation est interdite. Crédits photo : Pierre Maullet
            et autres photographes mentionnés.
          </p>
        </section>
      </div>
    </>
  );
}
