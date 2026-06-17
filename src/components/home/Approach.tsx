import { approach } from "@/content/approach";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/** Approche — process 4 étapes numérotées (brief §7 section 05, inspiré Studio X). */
export function Approach() {
  return (
    <section className="bg-sand py-24 md:py-32">
      <div className="container-x">
        <p className="label text-lin">Notre approche</p>
        <h2 className="display-h2 mt-4 max-w-2xl">
          De la première visite au <span className="accent-italic">dernier détail</span>
        </h2>

        <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2">
          {approach.map((step, i) => (
            <ScrollReveal
              key={step.index}
              delay={i * 0.05}
              className="flex gap-6 border-t border-ink/10 pt-6"
            >
              <span
                className="font-fraunces text-5xl italic leading-none md:text-6xl"
                style={{ fontVariationSettings: "'WONK' 1", color: "#efebe3" }}
                aria-hidden="true"
              >
                {step.index}
              </span>
              <div>
                <h3 className="label">{step.title}</h3>
                <p className="mt-2 max-w-prose text-lin">{step.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
