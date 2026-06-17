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
    <div className="relative h-[50vh] w-full overflow-hidden md:h-[60vh]">
      {src ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <Image src={poster} alt={alt} fill sizes="100vw" className="object-cover" />
      )}
    </div>
  );
}
