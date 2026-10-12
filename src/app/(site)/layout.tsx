import { localBusinessSchema, foundersSchema, jsonLd } from "@/lib/seo";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { Header } from "@/components/layout/Header";
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
        <Header />
        <main>{children}</main>
        <Footer />
        <BottomNav />
      </SmoothScroll>
    </>
  );
}
