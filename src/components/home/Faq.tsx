import { faq } from "@/content/faq";

/**
 * FAQ accordéon (brief §7 section 11 + §10).
 * Native <details>/<summary> : accessible au clavier ET tout le texte est dans le HTML
 * rendu (indexable Google + LLM), même replié. C'est le point SEO/GEO qui distingue
 * le site des références (qui n'ont pas de FAQ).
 */
export function Faq() {
  return (
    <section className="container-x py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
        <div>
          <p className="label text-lin">Questions fréquentes</p>
          <h2 className="display-h2 mt-4">Tout savoir avant de commencer</h2>
        </div>

        <div className="divide-y divide-ink/10 border-t border-ink/10">
          {faq.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-6 font-display text-xl marker:content-['']">
                {item.question}
                <span className="text-terre transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-prose text-lin">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
