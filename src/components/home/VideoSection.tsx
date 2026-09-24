import Image from "next/image";

/**
 * Vidéo loop en élément isolé (brief §4.6, inspiré Fluid Glass) — pas en fond de héro.
 * autoplay/muted/loop/playsInline + poster fallback.
 *
 * Les vidéos courtes étant en attente (brief §13), si `src` est absent on rend
 * proprement le poster (image réelle) — aucun lecteur cassé au lancement.
 */
export function VideoSection({
  src,
  poster,
  alt = "",
}: {
  src?: string;
  poster: string;
  alt?: string;
}) {
  return (
    <section className="bg-ink py-16 md:py-24">
      <div className="container-x grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <p className="label text-lin">En image</p>
          <h2 className="display-h2 mt-4 text-cream">
            Le studio <span className="accent-italic">en mouvement</span>
          </h2>
          <p className="mt-6 max-w-prose text-lin">
            Natalia présente le studio et l&apos;esprit La Casa de Anna.
          </p>
        </div>
        <div className="relative mx-auto aspect-[9/16] w-full max-w-[360px] overflow-hidden bg-black">
          {src ? (
            <video
              controls
              playsInline
              preload="metadata"
              poster={poster}
              className="absolute inset-0 h-full w-full object-cover"
              aria-label={alt}
            >
              <source src={src} type="video/mp4" />
            </video>
          ) : (
            <Image src={poster} alt={alt} fill sizes="360px" className="object-cover" />
          )}
        </div>
      </div>
    </section>
  );
}
