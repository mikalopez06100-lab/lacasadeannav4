import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et gestion des données personnelles — La Casa de Anna.",
  alternates: { canonical: "/politique-confidentialite" },
  robots: { index: false, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <>
      <PageHeader label="Informations" title="Confidentialité" />
      <div className="container-x max-w-prose space-y-8 pb-28 text-lin">
        <section>
          <h2 className="font-fraunces text-xl text-ink">Données collectées</h2>
          <p className="mt-3 leading-relaxed">
            Lorsque vous remplissez un formulaire de contact, nous collectons les
            informations que vous nous transmettez (nom, téléphone, e-mail, description
            de projet) dans le seul but de répondre à votre demande et, si vous y
            consentez, de vous adresser nos actualités.
          </p>
        </section>
        <section>
          <h2 className="font-fraunces text-xl text-ink">Utilisation</h2>
          <p className="mt-3 leading-relaxed">
            Vos données ne sont jamais revendues. Elles sont traitées par La Casa de Anna
            et son prestataire d&apos;e-mailing (Brevo) pour la gestion de la relation
            client. Une mesure d&apos;audience anonyme (Vercel Analytics) nous aide à
            améliorer le site, sans cookie publicitaire.
          </p>
        </section>
        <section>
          <h2 className="font-fraunces text-xl text-ink">Vos droits</h2>
          <p className="mt-3 leading-relaxed">
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
            rectification et de suppression de vos données. Pour l&apos;exercer, écrivez à{" "}
            <a href={`mailto:${site.email}`} className="text-ink hover:text-terre">
              {site.email}
            </a>
            .
          </p>
        </section>
      </div>
    </>
  );
}
