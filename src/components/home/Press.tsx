import { press } from "@/content/press";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/** Presse — citation Art & Décoration (brief §7 section 09). */
export function Press() {
  return (
    <section className="container-x py-24 text-center md:py-32">
      <ScrollReveal>
        <p className="label text-lin">Presse · {press.outlet}</p>
        <blockquote
          className="mx-auto mt-8 max-w-4xl font-fraunces text-3xl italic leading-snug md:text-5xl"
          style={{ fontVariationSettings: "'WONK' 1" }}
        >
          «&nbsp;{press.quote}&nbsp;»
        </blockquote>
        <cite className="label mt-8 block not-italic text-lin">
          {press.outlet} — « {press.feature} »
        </cite>
      </ScrollReveal>
    </section>
  );
}
