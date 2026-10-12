import { approach } from "@/content/approach";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/** Approche — process 4 étapes numérotées (brief §7 section 05, inspiré Studio X). */
export function Approach() {
  return (
    <section className="bg-sand py-16 md:py-24">
      <div className="container-x">
        <p className="label text-lin">Notre approche</p>
        <h2 className="display-h2 mt-4 max-w-2xl">
          Imaginer, concevoir, <span className="accent-italic">révéler</span>
        </h2>

        <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2">
          {approach.map((step, i) => (
            <ScrollReveal
              key={step.index}
              delay={i * 0.05}
              className="flex gap-6 border-t border-ink/10 pt-6"
            >
              <span
                className="font-display text-4xl italic leading-none md:text-5xl"
                style={{ color: "#efebe3" }}
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
