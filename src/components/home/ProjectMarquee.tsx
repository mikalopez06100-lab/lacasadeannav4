import Image from "next/image";
import Link from "next/link";

export type MarqueeItem = {
  slug: string;
  title: string;
  location: string;
  image: { src: string; width: number; height: number };
};

/**
 * Bandeau de réalisations qui défilent en continu (brief client v2 :
 * remplace la transition « rideau » sous le manifeste).
 * Chaque photo mène à sa fiche projet. Pause au survol ; mouvement coupé si
 * l'utilisateur demande moins d'animations (fallback : défilement au doigt).
 */
export function ProjectMarquee({ items }: { items: MarqueeItem[] }) {
  const card = (item: MarqueeItem, i: number, hidden: boolean) => (
    <Link
      key={`${hidden ? "b" : "a"}-${i}`}
      href={`/realisations/${item.slug}`}
      className="project-marquee-card group"
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
      draggable={false}
    >
      <Image
        src={item.image.src}
        alt={hidden ? "" : `${item.title} — ${item.location}`}
        width={item.image.width}
        height={item.image.height}
        sizes="(max-width: 768px) 70vw, 34vw"
        draggable={false}
        className="h-full w-auto object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
      />
      <span className="project-marquee-cap">
        <span className="font-display text-lg font-semibold tracking-tight md:text-xl">{item.title}</span>
        <span className="label mt-1 block text-cream/80">{item.location}</span>
      </span>
    </Link>
  );

  return (
    <section aria-label="Nos réalisations" className="py-4">
      <div className="project-marquee no-scrollbar">
        <div
          className="project-marquee-track"
          style={{ "--marquee-duration": `${items.length * 7}s` } as React.CSSProperties}
        >
          {items.map((item, i) => card(item, i, false))}
          {items.map((item, i) => card(item, i, true))}
        </div>
      </div>
    </section>
  );
}
