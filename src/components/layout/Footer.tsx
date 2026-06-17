import Link from "next/link";
import { site } from "@/content/site";

/**
 * Footer (brief §6). Grand mot-symbole Fraunces, NAP, périmètre national + international,
 * coordonnées, réseaux. Le périmètre n'est PAS « lac et montagne » comme frontière.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sand text-ink">
      <div className="container-x py-20 md:py-28">
        <p
          className="font-fraunces text-[clamp(3rem,11vw,7.5rem)] italic leading-none"
          style={{ fontVariationSettings: "'WONK' 1" }}
        >
          La Casa de Anna
        </p>

        <div className="mt-12 grid gap-8 border-t border-ink/10 pt-10 md:grid-cols-3">
          <div>
            <p className="label text-lin">Atelier</p>
            <p className="mt-3 leading-relaxed">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
              <br />
              {site.address.region}
            </p>
            <p className="mt-3 text-sm text-lin">
              Projets partout en France et à l&apos;international.
            </p>
          </div>

          <div>
            <p className="label text-lin">Contact</p>
            <p className="mt-3 leading-relaxed">
              <a href={`mailto:${site.email}`} className="hover:text-terre">
                {site.email}
              </a>
              <br />
              <a href={`tel:${site.phone}`} className="hover:text-terre">
                {site.phoneDisplay}
              </a>
            </p>
          </div>

          <div>
            <p className="label text-lin">Suivre</p>
            <p className="mt-3 flex flex-col gap-1">
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-terre">
                Instagram {site.social.instagramHandle}
              </a>
              <a href={site.social.pinterest} target="_blank" rel="noopener noreferrer" className="hover:text-terre">
                Pinterest
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink/10 pt-6 text-sm text-lin md:flex-row md:items-center md:justify-between">
          <p>© {year} La Casa de Anna — SARL depuis {site.founded}</p>
          <nav className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-terre">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-terre">Confidentialité</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
