import { localBusinessSchema, foundersSchema, jsonLd } from "@/lib/seo";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { Header } from "@/components/layout/Header";
import { SaleBanner } from "@/components/layout/SaleBanner";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";

/** Habillage du site public (l'admin a le sien, sans curseur ni smooth scroll). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([localBusinessSchema(), ...foundersSchema()]),
        }}
      />
      <SmoothScroll>
        <CustomCursor />
        <SaleBanner />
        <Header />
        {/* Le bandeau (fixe) publie sa hauteur : le contenu glisse d'autant, le hero de l'accueil la compense */}
        <main className="pt-[var(--sale-banner-h,0px)]">{children}</main>
        <Footer />
        <BottomNav />
      </SmoothScroll>
    </>
  );
}
