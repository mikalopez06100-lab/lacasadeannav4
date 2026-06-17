import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/cta/ContactForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact — démarrer un projet",
  description:
    "Contactez le studio La Casa de Anna pour votre projet de design d'intérieur. Consultation à domicile ou en visio, partout en France et à l'international.",
  alternates: { canonical: "/contact" },
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.address.street}, ${site.address.postalCode} ${site.address.city}`,
)}`;

export default function ContactPage() {
  return (
    <>
      <PageHeader
        label="Contact"
        title={
          <>
            Votre projet <span className="accent-italic">commence ici</span>
          </>
        }
        intro="Parlez-nous de votre espace, de votre vie, de vos envies. Nous vous recontactons rapidement pour définir ensemble la meilleure façon d'avancer."
      />

      <section className="container-x grid gap-12 pb-28 md:grid-cols-2 md:gap-20">
        <div className="space-y-10">
          <div>
            <p className="label text-lin">Écrire</p>
            <p className="mt-3 text-lg">
              <a href={`mailto:${site.email}`} className="hover:text-terre">
                {site.email}
              </a>
            </p>
          </div>
          <div>
            <p className="label text-lin">Appeler</p>
            <p className="mt-3 text-lg">
              <a href={`tel:${site.phone}`} className="hover:text-terre">
                {site.phoneDisplay}
              </a>
            </p>
          </div>
          <div>
            <p className="label text-lin">Atelier</p>
            <p className="mt-3 leading-relaxed">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}, {site.address.region}
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="label mt-3 inline-block border-b border-ink pb-1 transition-colors hover:border-terre hover:text-terre"
            >
              Voir sur la carte →
            </a>
          </div>
          <div>
            <p className="label text-lin">Suivre</p>
            <p className="mt-3">
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-terre">
                Instagram {site.social.instagramHandle}
              </a>
            </p>
          </div>
          <p className="max-w-prose text-sm text-lin">
            Ancrés à Veyrier-du-Lac, nous travaillons partout en France et à
            l&apos;international — à distance et sur place.
          </p>
        </div>

        <div className="bg-ink p-8 text-cream md:p-12">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
